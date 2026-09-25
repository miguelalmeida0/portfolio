#!/usr/bin/env python3
"""Original soundtrack for the portfolio film.

96 BPM in D major, 25 s: ten bars of 2.5 s, one bar per scene, so every cut lands on
a bar line. Music and sound effects are synthesised together and share one reverb
and one delay, so the effects sit inside the track instead of on top of it. The
sonic logo is the hook's "confirmed" chime (a rising grace-note pair); it comes back
on each product's confirmation moment and resolves in the end card.

Deterministic (seeded) and dependency-light: numpy + scipy.

    python3 brag-output/work/soundtrack.py
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d

HERE = Path(__file__).resolve().parent
OUT = HERE / "audio"

SR = 48_000
BPM = 96
BEAT = 60 / BPM  # 0.625 s
BAR = 4 * BEAT  # 2.5 s
STEP = BEAT / 4  # one 16th
DURATION = 25.0
N = int(round(SR * DURATION))
TAIL = 4 * SR  # room for reverb tails past the end before the final trim

rng = np.random.default_rng(1592)


# ----------------------------------------------------------------- helpers


def hz(m):
    return 440.0 * 2.0 ** ((np.asarray(m, dtype=float) - 69.0) / 12.0)


def db(v):
    return 10.0 ** (v / 20.0)


def at(bar, step=0.0):
    """Time of a 16th step inside a 1-indexed bar."""
    return (bar - 1) * BAR + step * STEP


def times(n):
    return np.arange(n) / SR


def sos(kind, freq, order=2):
    return signal.butter(order, freq, kind, fs=SR, output="sos")


def filt(x, kind, freq, order=2):
    return signal.sosfilt(sos(kind, freq, order), x, axis=0)


def stereo(y, pan=0.0):
    if y.ndim == 2:
        return y
    th = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    return np.stack([y * np.cos(th), y * np.sin(th)], axis=1)


def attack(n, secs):
    return 1.0 - np.exp(-times(n) / max(secs, 1e-5))


def finish(y, fade=0.03):
    """Fade the end of a voice buffer so a still-ringing note never stops with a click."""
    n = min(len(y), int(fade * SR))
    ramp = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, n))
    y = np.array(y, dtype=float, copy=True)
    y[-n:] *= ramp if y.ndim == 1 else ramp[:, None]
    return y


def saw(freq, n, phase=0.0):
    """PolyBLEP sawtooth, per-sample or constant frequency."""
    inc = np.broadcast_to(np.asarray(freq, dtype=float) / SR, (n,)).copy()
    ph = (phase + np.cumsum(inc)) % 1.0
    y = 2.0 * ph - 1.0
    m = ph < inc
    x = ph[m] / inc[m]
    y[m] -= x + x - x * x - 1.0
    m = ph > 1.0 - inc
    x = (ph[m] - 1.0) / inc[m]
    y[m] -= x * x + x + x + 1.0
    return y


def svf(x, fc, q=0.707, mode="lp"):
    """Zero-delay-feedback state-variable filter with a per-sample cutoff."""
    n = len(x)
    fc = np.broadcast_to(np.asarray(fc, dtype=float), (n,))
    g = np.tan(np.pi * np.clip(fc, 12.0, SR * 0.45) / SR)
    k = 1.0 / q
    a1 = (1.0 / (1.0 + g * (g + k))).tolist()
    a2 = (g * np.asarray(a1)).tolist()
    a3 = (g * np.asarray(a2)).tolist()
    xs = x.tolist()
    v1s = [0.0] * n
    v2s = [0.0] * n
    ic1 = ic2 = 0.0
    for i in range(n):
        v3 = xs[i] - ic2
        v1 = a1[i] * ic1 + a2[i] * v3
        v2 = ic2 + a2[i] * ic1 + a3[i] * v3
        ic1 = 2.0 * v1 - ic1
        ic2 = 2.0 * v2 - ic2
        v1s[i] = v1
        v2s[i] = v2
    v1 = np.asarray(v1s)
    v2 = np.asarray(v2s)
    if mode == "lp":
        return v2
    if mode == "bp":
        return v1 * k  # unity gain at the centre
    return np.asarray(xs) - k * v1 - v2


def curve(points, n=N + TAIL, shape="exp"):
    """Piecewise automation from (time, value) points, exponential between points."""
    t = times(n)
    ts = np.array([p[0] for p in points])
    vs = np.array([p[1] for p in points], dtype=float)
    if shape == "exp":
        return np.exp(np.interp(t, ts, np.log(vs)))
    return np.interp(t, ts, vs)


class Bus:
    def __init__(self, name):
        self.name = name
        self.x = np.zeros((N + TAIL, 2))

    def add(self, y, t, gain=1.0, pan=0.0):
        y = stereo(np.asarray(y, dtype=float), pan) * gain
        i = int(round(t * SR))
        if i < 0:
            y = y[-i:]
            i = 0
        j = min(len(self.x), i + len(y))
        if j > i:
            self.x[i:j] += y[: j - i]


# ------------------------------------------------------------- instruments


def kick(vel=1.0):
    n = int(0.55 * SR)
    t = times(n)
    f = 55.0 + 120.0 * np.exp(-t / 0.032)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.28)
    click = filt(rng.standard_normal(n) * np.exp(-t / 0.002), "bandpass", [1800, 6500]) * 0.22
    y = np.tanh(1.8 * (body + click)) / np.tanh(1.8)
    return finish(y * attack(n, 0.0006) * vel, 0.08)


def clap(vel=1.0):
    n = int(0.5 * SR)
    t = times(n)
    env = np.zeros(n)
    for k, off in enumerate((0.0, 0.010, 0.021)):
        i = int(off * SR)
        env[i:] += np.exp(-t[: n - i] / 0.0055) * (0.75 if k < 2 else 1.0)
    i = int(0.021 * SR)
    env[i:] += 0.32 * np.exp(-t[: n - i] / 0.13)
    y = filt(rng.standard_normal(n) * env, "bandpass", [950, 5200])
    body = np.sin(2 * np.pi * 196.0 * t) * np.exp(-t / 0.028) * 0.18
    return finish((y + body) * vel, 0.05)


METAL = np.array([205.3, 304.4, 369.6, 522.7, 540.0, 800.0]) * 1.75


def hat(vel=1.0, open_=False):
    n = int((0.42 if open_ else 0.07) * SR)
    t = times(n)
    metal = sum(np.sign(np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28))) for f in METAL) / 6
    y = filt(0.45 * metal + rng.standard_normal(n), "highpass", 7200, 4)
    y *= np.exp(-t / (0.11 if open_ else 0.016)) * attack(n, 0.0004)
    return finish(y * vel * 0.5, 0.01)


def shaker(vel=1.0):
    n = int(0.09 * SR)
    t = times(n)
    env = attack(n, 0.009) * np.exp(-t / 0.028)
    return filt(rng.standard_normal(n), "bandpass", [5200, 11000]) * env * vel * 0.4


def glass(m, dur=1.8, vel=1.0, bright=1.0):
    """Clean glassy chime: the film's UI and logo voice."""
    n = int(dur * SR)
    t = times(n)
    f = float(hz(m))
    out = np.zeros((n, 2))
    for ch, cents in enumerate((-1.6, 1.6)):
        fd = f * 2 ** (cents / 1200)
        y = np.zeros(n)
        for ratio, amp, decay in ((1.0, 1.0, 1.25), (2.0, 0.26 * bright, 0.42), (3.0, 0.08 * bright, 0.22), (4.17, 0.045 * bright, 0.1)):
            if fd * ratio < 15000:
                y += amp * np.sin(2 * np.pi * fd * ratio * t + rng.uniform(0, 6.28)) * np.exp(-t / decay)
        out[:, ch] = y
    click = filt(rng.standard_normal(n) * np.exp(-t / 0.0007), "highpass", 3000) * 0.05
    out += click[:, None]
    return finish(out * attack(n, 0.0012)[:, None] * vel * 0.5, 0.25)


def pluck(m, vel=1.0, bright=1.0):
    n = int(0.75 * SR)
    t = times(n)
    f = float(hz(m))
    index = (0.35 + 2.4 * bright) * np.exp(-t / 0.045) + 0.2
    carrier = np.sin(2 * np.pi * f * t + index * np.sin(2 * np.pi * f * t))
    y = (0.72 * carrier + 0.28 * np.sin(2 * np.pi * f * t)) * attack(n, 0.001) * np.exp(-t / 0.19)
    return finish(y * vel, 0.05)


def keys(m, dur=3.2, vel=1.0):
    """Soft felt-piano voice for the breakdown and the final chord."""
    n = int(dur * SR)
    t = times(n)
    f0 = float(hz(m))
    y = np.zeros(n)
    for k in range(1, 12):
        fk = k * f0 * np.sqrt(1 + 0.00022 * k * k)
        if fk > 11000:
            break
        amp = vel ** (0.4 + 0.12 * k) / k ** 1.3
        y += amp * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) * np.exp(-t / (2.6 / k ** 0.7))
    hammer = filt(rng.standard_normal(n) * np.exp(-t / 0.006), "lowpass", 1800) * 0.04
    y = filt((y + hammer) * attack(n, 0.004), "lowpass", 3200)
    return finish(y * 0.32, 0.35)


def sub(m, dur, vel=1.0):
    n = int(dur * SR)
    t = times(n)
    f = float(hz(m))
    y = np.sin(2 * np.pi * f * t)
    y = np.tanh(1.3 * y) / np.tanh(1.3)
    env = attack(n, 0.005) * np.minimum(1.0, (dur - t) / 0.05).clip(0, 1)
    return y * env * vel


def midbass(m, dur, vel=1.0):
    n = int(dur * SR)
    t = times(n)
    y = filt(saw(float(hz(m)), n, rng.uniform()), "lowpass", 820, 2)
    env = attack(n, 0.006) * np.exp(-t / 0.5) * np.minimum(1.0, (dur - t) / 0.04).clip(0, 1)
    return y * env * vel


def pad_notes(bus, t0, t1, notes, level=1.0, fade_in=0.35, release=0.7):
    dur = t1 - t0 + release
    n = int(dur * SR)
    t = times(n)
    env = np.clip(t / fade_in, 0, 1) ** 1.5
    env *= np.clip((t1 - t0 + release - t) / release, 0, 1) ** 1.3
    for m in notes:
        f = float(hz(m))
        for cents, pan in ((-9, -0.65), (0, 0.0), (9, 0.65)):
            y = saw(f * 2 ** (cents / 1200), n, rng.uniform())
            bus.add(y * env * level * 0.12, t0, pan=pan)


def whoosh(dur, f0, f1, peak=0.55, q=1.3, pan0=0.0, pan1=0.0, shape=2.0):
    n = int(dur * SR)
    u = times(n) / dur
    y = svf(rng.standard_normal(n), f0 * (f1 / f0) ** u, q, "bp")
    env = np.where(u < peak, (u / peak) ** shape, ((1 - u) / (1 - peak)) ** (shape * 0.9))
    pans = pan0 + (pan1 - pan0) * u
    th = (np.clip(pans, -1, 1) + 1) * np.pi / 4
    y = y * env
    return np.stack([y * np.cos(th), y * np.sin(th)], axis=1)


def riser(dur, f0=500.0, f1=7000.0, tone=(57, 69)):
    n = int(dur * SR)
    u = times(n) / dur
    noise = svf(rng.standard_normal(n), f0 * (f1 / f0) ** u, 0.9, "hp")
    env = u ** 2.4
    f = hz(tone[0]) * (hz(tone[1]) / hz(tone[0])) ** (u ** 1.4)
    tone_y = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.18 * u ** 1.8
    y = noise * env + tone_y
    width = 0.3 + 0.7 * u
    return finish(np.stack([y * (1 - 0.15 * width), y * (1 - 0.15 * (1 - width))], axis=1), 0.012)


def impact(vel=1.0, f0=92.0, f1=36.7):
    n = int(1.8 * SR)
    t = times(n)
    f = f1 + (f0 - f1) * np.exp(-t / 0.09)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.6)
    thud = filt(rng.standard_normal(n) * np.exp(-t / 0.06), "lowpass", 700) * 0.5
    y = np.tanh(1.5 * (boom + thud)) / np.tanh(1.5)
    return finish(y * attack(n, 0.001) * vel, 0.3)


def crash(vel=1.0, decay=1.6):
    n = int((decay * 2.2) * SR)
    t = times(n)
    metal = sum(np.sign(np.sin(2 * np.pi * f * 1.37 * t + rng.uniform(0, 6.28))) for f in METAL) / 6
    y = filt(0.35 * metal + rng.standard_normal(n), "highpass", 3200, 2)
    y = filt(y, "lowpass", 12500, 2) * np.exp(-t / decay) * attack(n, 0.002)
    out = np.stack([y, np.roll(y, 37)], axis=1)
    return finish(out * vel * 0.35, 0.4)


def ui_click(vel=1.0, pitch=2400.0):
    n = int(0.05 * SR)
    t = times(n)
    tick = np.sin(2 * np.pi * pitch * t) * np.exp(-t / 0.006)
    noise = filt(rng.standard_normal(n) * np.exp(-t / 0.0015), "bandpass", [1500, 6000]) * 0.6
    return (tick * 0.5 + noise) * vel


def tick(vel=1.0):
    n = int(0.03 * SR)
    t = times(n)
    return filt(rng.standard_normal(n) * np.exp(-t / 0.0025), "bandpass", [2600, 7500]) * vel


def reverse_swell(notes, length=2.0, ir=None):
    """A chord rendered through the reverb and reversed, so it breathes into a hit."""
    n = int(1.2 * SR)
    dry = np.zeros((n, 2))
    for m in notes:
        k = keys(m, 1.2, 0.8)
        dry += np.stack([k, k], axis=1)
    wet = np.stack([signal.fftconvolve(dry[:, c], ir[:, c]) for c in range(2)], axis=1)
    wet = wet[::-1]
    wet = wet[-int(length * SR) :]
    u = np.linspace(0, 1, len(wet))
    return finish(wet * (u ** 1.6)[:, None], 0.008)


# ------------------------------------------------------------------ spaces


def make_ir(rt60=2.3, rt60_high=1.0, predelay=0.02, length=3.4, seed=7):
    r = np.random.default_rng(seed)
    n = int(length * SR)
    t = times(n)
    ir = np.zeros((n, 2))
    for ch in range(2):
        noise = r.standard_normal(n)
        low = filt(noise, "lowpass", 2600)
        high = noise - low
        ir[:, ch] = low * np.exp(-6.91 * t / rt60) + high * np.exp(-6.91 * t / rt60_high)
        # A few early reflections.
        for _ in range(9):
            i = int(r.uniform(0.004, 0.07) * SR)
            ir[i, ch] += r.uniform(0.6, 1.4) * (1 - i / (0.08 * SR)) * 6
    ir *= (1 - np.exp(-t / 0.01))[:, None]
    ir = np.vstack([np.zeros((int(predelay * SR), 2)), ir])
    return ir / np.sqrt(np.sum(ir**2) / 2)


def pingpong(x, time=3 * STEP, fb=0.36, taps=6):
    out = np.zeros_like(x)
    d = int(round(time * SR))
    y = x.mean(axis=1)
    lp = sos("lowpass", 4200, 1)
    for k in range(1, taps + 1):
        y = signal.sosfilt(lp, y)
        if d * k >= len(y):
            break
        out[d * k :, (k - 1) % 2] += y[: len(y) - d * k] * fb ** (k - 1) * 0.55
    return out


def sidechain(kicks, depth, release=0.13, n=N + TAIL):
    g = np.ones(n)
    t = times(int(release * 6 * SR))
    shape = depth * np.exp(-t / release) * (1 - np.exp(-t / 0.004))
    for when, vel in kicks:
        i = int(round(when * SR))
        j = min(n, i + len(shape))
        g[i:j] = np.minimum(g[i:j], 1 - shape[: j - i] * vel)
    return g[:, None]


# ------------------------------------------------------------------ master


K1 = ([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585])
K2 = ([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])


def lufs(x):
    y = signal.lfilter(*K2, signal.lfilter(*K1, x, axis=0), axis=0)
    block, hop = int(0.4 * SR), int(0.1 * SR)
    ms = np.array([np.mean(y[i : i + block] ** 2, axis=0).sum() for i in range(0, len(y) - block, hop)])
    loud = -0.691 + 10 * np.log10(ms + 1e-15)
    ms = ms[loud > -70]
    gate = -0.691 + 10 * np.log10(ms.mean()) - 10
    ms = ms[-0.691 + 10 * np.log10(ms) > gate]
    return -0.691 + 10 * np.log10(ms.mean())


def true_peak_db(x):
    up = signal.resample_poly(x, 4, 1, axis=0)
    return 20 * np.log10(np.max(np.abs(up)) + 1e-12)


def glue(x, threshold_db=-16.0, ratio=1.8, attack_s=0.02, release_s=0.22):
    level = signal.lfilter([1 - np.exp(-1 / (0.03 * SR))], [1, -np.exp(-1 / (0.03 * SR))], np.mean(x**2, axis=1))
    level_db = 10 * np.log10(level + 1e-12)
    over = np.maximum(0.0, level_db - threshold_db)
    target = db(-over * (1 - 1 / ratio)).tolist()
    a = np.exp(-1 / (attack_s * SR))
    r = np.exp(-1 / (release_s * SR))
    g = [1.0] * len(target)
    s = 1.0
    for i, v in enumerate(target):
        s = a * s + (1 - a) * v if v < s else r * s + (1 - r) * v
        g[i] = s
    return x * np.asarray(g)[:, None]


def limit(x, ceiling_db=-1.3, lookahead=0.004, release=0.09):
    ceil = db(ceiling_db)
    need = np.minimum(1.0, ceil / np.maximum(np.max(np.abs(x), axis=1), 1e-9))
    la = int(lookahead * SR)
    g = uniform_filter1d(minimum_filter1d(need, size=2 * la + 1, mode="nearest"), size=2 * la + 1, mode="nearest")
    r = np.exp(-1 / (release * SR))
    gs = g.tolist()
    s = 1.0
    for i, v in enumerate(gs):
        s = v if v < s else r * s + (1 - r) * v
        gs[i] = s
    return x * np.asarray(gs)[:, None]


# ---------------------------------------------------------------- the score

# Harmony, one chord per bar (bar 5 and 9 resolve their suspension on beat 3).
# D major: V (intro) · I · vi · IV · V · I · vi · IV (lift) · V (breakdown) · I.
SUS_A = [55, 62, 64, 69]  # A7sus4: G3 D4 E4 A4
PAD = {
    1: [(0, 4, SUS_A)],
    2: [(0, 4, [54, 57, 61, 64])],  # Dmaj9 (F#3 A3 C#4 E4)
    3: [(0, 4, [54, 57, 62, 64])],  # Bm11 (F#3 A3 D4 E4)
    4: [(0, 4, [54, 57, 59, 62])],  # Gmaj9 (F#3 A3 B3 D4)
    5: [(0, 2, [54, 57, 62, 64]), (2, 4, [54, 57, 61, 64])],  # A6sus4 -> A6
    6: [(0, 4, [54, 57, 61, 64])],  # Dmaj9
    7: [(0, 4, [54, 57, 62, 64])],  # Bm11
    8: [(0, 4, [54, 57, 59, 62, 66])],  # Gmaj9, wider for the lift
    9: [(0, 2, SUS_A), (2, 4, [55, 61, 64, 69])],  # A7sus4 -> A7
    10: [(0, 4, [50, 54, 57, 61, 64, 69])],  # Dmaj9, full
}
ROOT = {1: 45, 2: 38, 3: 35, 4: 31, 5: 33, 6: 38, 7: 35, 8: 31, 9: 33, 10: 38}
ARP = {
    2: [74, 76, 78, 81, 85, 86],
    3: [71, 74, 76, 78, 81, 83],
    4: [67, 71, 74, 78, 81, 83],
    5: [69, 73, 76, 78, 81, 85],
    6: [74, 76, 78, 81, 85, 86],
    7: [71, 74, 76, 78, 81, 83],
    8: [79, 83, 86, 90, 93, 95],
}
ARP_PATTERN = [0, 2, 4, 2, 1, 3, 4, 3, 0, 2, 4, 5, 4, 3, 2, 1]


def compose():
    buses = {name: Bus(name) for name in ("drums", "bass", "pad", "arp", "bells", "keys", "fx")}
    sends = {"reverb": Bus("reverb"), "delay": Bus("delay")}
    ir = make_ir()
    kicks = []
    cues = []

    def send(y, t, reverb=0.0, delay=0.0, pan=0.0):
        if reverb:
            sends["reverb"].add(y, t, reverb, pan)
        if delay:
            sends["delay"].add(y, t, delay, pan)

    def chime(notes, t, vel=1.0, gap=STEP / 2, reverb=0.3, delay=0.18, pan=0.0, label=""):
        for i, m in enumerate(notes):
            y = glass(m, vel=vel * (0.82 if i == 0 else 1.0))
            buses["bells"].add(y, t + i * gap, pan=pan)
            send(y, t + i * gap, reverb, delay, pan)
        if label:
            cues.append((t, label))

    def fx(y, t, gain, reverb=0.25, pan=0.0, label=""):
        buses["fx"].add(y, t, gain, pan)
        send(y * gain, t, reverb, 0.0, pan)
        if label:
            cues.append((t, label))

    # --- pad
    for bar, segments in PAD.items():
        for b0, b1, notes in segments:
            t0 = at(bar, b0 * 4)
            t1 = at(bar, b1 * 4)
            level = {1: 0.8, 9: 0.9, 10: 1.1}.get(bar, 1.0)
            fade = 1.4 if bar == 1 else (0.05 if b0 else 0.12)
            release = 2.6 if bar == 10 else 0.5
            pad_notes(buses["pad"], t0, t1, notes, level, fade, release)

    # --- bass (bars 2-8), a sub plus a mid voice so small speakers hear the line
    bass_pattern = [(0, 6, 0, 1.0), (6, 2, 12, 0.62), (8, 6, 0, 0.95), (14, 2, 7, 0.7)]
    for bar in range(2, 9):
        root = ROOT[bar]
        for step, length, offset, vel in bass_pattern:
            t0 = at(bar, step)
            dur = length * STEP * 0.96
            m = root + offset
            buses["bass"].add(sub(m, dur, vel), t0, 0.4)
            buses["bass"].add(midbass(m + 12, dur, vel), t0, 0.3)

    # --- drums
    for bar in range(2, 9):
        k_steps = [(0, 1.0), (8, 0.92)]
        if bar in (3, 5, 7):
            k_steps.append((10, 0.5))
        if bar == 8:
            k_steps.append((14, 0.55))
        for step, vel in k_steps:
            buses["drums"].add(kick(vel), at(bar, step), 0.6)
            kicks.append((at(bar, step), vel))
        for step in (4, 12):
            y = clap(0.9)
            buses["drums"].add(y, at(bar, step), 0.72, pan=0.04)
            send(y * 0.72, at(bar, step), 0.22)
        for step in range(16):
            onbeat = step % 4 == 0
            offbeat = step % 2 == 0 and not onbeat
            if bar == 8 and offbeat:
                y = hat(0.6, open_=True)
                buses["drums"].add(y, at(bar, step), 0.55, pan=0.22)
                continue
            vel = 0.8 if offbeat else (0.42 if onbeat else (0.22 if bar >= 4 else 0.0))
            if vel:
                vel *= rng.uniform(0.9, 1.08)
                buses["drums"].add(hat(vel), at(bar, step) + rng.uniform(-0.002, 0.003), 0.72, pan=0.22)
        if bar >= 4:
            for step in range(16):
                buses["drums"].add(shaker(0.35 + 0.25 * (step % 2 == 0)), at(bar, step) + 0.004, 0.85, pan=-0.35)
    # Fills into the montage and into the lift.
    for t, vel in ((at(3, 14), 0.28), (at(3, 15), 0.42), (at(7, 15), 0.4)):
        buses["drums"].add(clap(vel), t, 0.7)
        send(clap(vel) * 0.7, t, 0.25)

    # --- arpeggio (bars 2-8), filtered open over the first two bars
    for bar, notes in ARP.items():
        for step, idx in enumerate(ARP_PATTERN):
            m = notes[min(idx, len(notes) - 1)]
            accent = 1.0 if step % 4 == 0 else (0.72 if step % 2 == 0 else 0.58)
            level = 0.55 if bar in (2, 3) else 0.75
            y = pluck(m, accent * rng.uniform(0.93, 1.05), bright=0.6 if bar < 4 else 1.0)
            pan = -0.35 if step % 2 else 0.35
            buses["arp"].add(y, at(bar, step), 0.2 * level, pan=pan)
            send(y * 0.2 * level, at(bar, step), 0.12, 0.24, pan)

    # --- keys: breakdown and the final chord
    for m in (57, 62, 64, 67):
        y = keys(m, 2.4, 0.7)
        buses["keys"].add(y, at(9, 0), 0.9, pan=(m - 62) / 18)
        send(y * 0.9, at(9, 0), 0.35)
    for m in (57, 61, 64, 67):
        y = keys(m, 1.4, 0.6)
        buses["keys"].add(y, at(9, 8), 0.8, pan=(m - 62) / 18)
        send(y * 0.8, at(9, 8), 0.35)
    for m in (50, 57, 62, 66, 69, 73, 76):
        y = keys(m, 3.2, 0.85)
        buses["keys"].add(y, at(10, 0), 0.95, pan=(m - 64) / 26)
        send(y * 0.95, at(10, 0), 0.45)

    # ------------------------------------------------- sound design, in key

    # 0.00 the slit draws, the aperture opens.
    fx(whoosh(0.9, 2400, 9000, peak=0.3, q=2.2, pan0=-0.5, pan1=0.5), 0.0, 0.05, 0.4, label="slit")
    fx(whoosh(0.95, 260, 2300, peak=0.55, q=1.1), 0.12, 0.12, 0.35, label="aperture opens")
    fx(impact(0.35, 70, 36.7), 0.12, 0.35, 0.1)

    # 0.31-1.56 Camera Harness labels: soft pings, then the confirmed chimes (the logo).
    for t_ping, t_ok, pair, pan in (
        (at(1, 2), at(1, 4), (81, 86), -0.1),  # Miguel Almeida ✓
        (at(1, 5), at(1, 7), (86, 88), 0.1),  # Frontend engineer ✓
        (at(1, 8), at(1, 10), (88, 93), -0.15),  # React · TypeScript · Svelte ✓
    ):
        y = glass(76, 0.6, 0.5, bright=0.4)
        buses["bells"].add(y, t_ping, 0.45, pan=pan)
        send(y * 0.45, t_ping, 0.3, 0.2, pan)
        cues.append((t_ping, "label appears"))
        chime(pair, t_ok, 0.9, pan=pan, label="label confirmed")

    # 1.25-2.50 breath in: reversed chord swell, riser, then the drop.
    swell = reverse_swell([57, 62, 66, 69], 1.4, ir)
    fx(swell, 2.5 - len(swell) / SR, 0.09, 0.0)
    fx(riser(1.2, 600, 8000, (57, 69)), 1.27, 0.07, 0.2, label="riser")
    fx(impact(1.0), 2.5, 0.55, 0.12, label="drop: hero")
    fx(crash(0.8), 2.5, 0.4, 0.2)
    kicks.append((2.5, 1.0))

    # Hero: the cursor clicks "Explore my work", the page scrolls to Selected work.
    fx(ui_click(1.0, 2350), 5.9375, 0.16, 0.12, label="click: Explore my work")
    fx(whoosh(0.8, 2600, 520, peak=0.45, q=1.2, pan0=0.2, pan1=-0.1), 6.22, 0.14, 0.25, label="scroll")
    for i in range(5):
        fx(tick(0.9), 6.62 + i * 0.06, 0.035, 0.3, pan=-0.6 + 0.3 * i)

    # 7.50 Second Voice: tile opens into the chapter, its own button press, the rewrite.
    fx(whoosh(0.7, 380, 3200, peak=0.5, q=1.2, pan0=-0.4, pan1=0.2), 7.36, 0.13, 0.25, label="chapter: Second Voice")
    fx(ui_click(0.8, 2100), 8.125, 0.12, 0.15, label="click: Rewrite as Tolkien")
    fx(whoosh(0.45, 900, 4200, peak=0.7, q=1.4), 8.2, 0.07, 0.25)
    for step in range(8):
        fx(tick(0.85), 8.75 + step * STEP / 2, 0.028, 0.25, pan=rng.uniform(-0.3, 0.3))
    chime((74, 81), at(4, 8), 0.55, label="rewrite begins")

    # 10.00 Mirror AI: media slides in from the right; the contour closes; inspector opens.
    fx(whoosh(0.7, 500, 3600, peak=0.4, q=1.1, pan0=0.7, pan1=-0.5), 9.9, 0.13, 0.25, label="chapter: Mirror AI")
    chime((76, 81), 10.625, 0.8, pan=0.15, label="contour selected")
    fx(glass(85, 0.5, 0.45, 0.3), 11.125, 0.3, 0.3, pan=-0.2, label="inspector opens")

    # 12.50 Camera Harness: an iris opens on the camera; the result asks for confirmation.
    fx(ui_click(1.0, 1700), 12.5, 0.12, 0.15, label="chapter: Camera Harness (iris)")
    fx(ui_click(0.7, 2600), 12.535, 0.08, 0.15)
    fx(whoosh(0.9, 300, 2600, peak=0.35, q=1.0), 12.46, 0.12, 0.3)
    chime((74, 78), 12.8125, 0.75, pan=0.1, label="result: needs confirmation")

    # 15.00 VIGIA: a low sweep into the operational picture; a cut on beat 3.
    fx(whoosh(0.9, 180, 1300, peak=0.4, q=1.0, pan0=-0.2, pan1=0.2), 14.85, 0.16, 0.3, label="chapter: VIGIA")
    fx(impact(0.3, 60, 30.9), 15.0, 0.3, 0.1)
    fx(ui_click(0.6, 1500), 16.25, 0.09, 0.2, label="cut: event response")
    fx(glass(83, 1.2, 0.45, 0.2), 16.25, 0.22, 0.45, pan=0.25)

    # 17.50 F24: the frame opens to full bleed — the lift.
    fx(impact(0.75, 85, 49.0), 17.5, 0.42, 0.12, label="lift: F24")
    fx(crash(0.7), 17.5, 0.35, 0.25)
    fx(whoosh(0.8, 300, 2800, peak=0.4, q=1.0), 17.38, 0.12, 0.3)
    kicks.append((17.5, 0.8))

    # 20.00 thesis: the photo folds into the recap strip; the breakdown builds.
    fx(whoosh(0.8, 2800, 380, peak=0.35, q=1.1), 19.94, 0.12, 0.3, label="breakdown: thesis")
    for i in range(4):
        fx(tick(0.8), 20.4 + i * 0.07, 0.03, 0.3, pan=-0.45 + 0.3 * i)
    build = [at(9, s) for s in (8, 10, 12, 13, 14, 15)] + [at(9, 15.5)]
    for i, t in enumerate(build):
        vel = 0.25 + 0.6 * i / (len(build) - 1)
        y = filt(clap(vel), "highpass", 600 + 900 * i)
        buses["drums"].add(y, t, 0.62)
        send(y * 0.62, t, 0.3)
    fx(riser(1.45, 400, 9000, (57, 69)), 20.97, 0.08, 0.25, label="riser")

    # 22.50 end card: the resolve. Kick, sub, crash and the full chime.
    fx(impact(1.0, 95, 36.7), 22.5, 0.6, 0.15, label="final hit: end card")
    fx(crash(1.0, 2.2), 22.5, 0.45, 0.3)
    buses["drums"].add(kick(1.0), 22.5, 0.7)
    kicks.append((22.5, 1.0))
    for i, m in enumerate((86, 90, 93, 97)):
        y = glass(m, 2.6, 0.75 - 0.08 * i)
        t = 22.5 + i * STEP / 2
        buses["bells"].add(y, t, pan=-0.3 + 0.2 * i)
        send(y, t, 0.45, 0.25, -0.3 + 0.2 * i)
    cues.append((22.5, "logo chime"))
    fx(tick(0.7), 23.66, 0.03, 0.3, label="url arrow steps")

    return buses, sends, ir, kicks, cues


def mix(buses, sends, ir, kicks):
    pad_cut = curve([(0, 300), (1.9, 1100), (2.49, 1700), (2.5, 2300), (7.5, 2900), (17.5, 3200), (17.51, 4200), (20.0, 3600), (20.01, 1800), (22.45, 4800), (22.5, 4200), (25, 1600), (29, 1200)])
    arp_cut = curve([(0, 900), (2.5, 1100), (7.4, 3400), (7.5, 4600), (17.5, 5200), (17.51, 6800), (29, 6800)])
    kick_duck = sidechain(kicks, 1.0)

    pad = buses["pad"].x
    pad = np.stack([svf(pad[:, c], pad_cut, 0.8) for c in range(2)], axis=1)
    pad = filt(pad, "highpass", 140, 2)
    arp = buses["arp"].x
    arp = np.stack([svf(arp[:, c], arp_cut, 0.9) for c in range(2)], axis=1)

    duck_pad = 1 - (1 - kick_duck) * 0.42
    duck_bass = 1 - (1 - kick_duck) * 0.72
    duck_arp = 1 - (1 - kick_duck) * 0.3

    dry = (
        buses["drums"].x * db(-1.5)
        + buses["bass"].x * duck_bass * db(-2.0)
        + pad * duck_pad * db(0.5)
        + arp * duck_arp * db(3.0)
        + buses["bells"].x * db(-3.0)
        + buses["keys"].x * db(-1.0)
        + buses["fx"].x * db(0.0)
    )
    # Pad and keys feed the space too.
    sends["reverb"].x += pad * 0.12 + buses["keys"].x * 0.0

    wet = np.stack([signal.fftconvolve(sends["reverb"].x[:, c], ir[:, c])[: N + TAIL] for c in range(2)], axis=1)
    wet = filt(filt(wet, "highpass", 220, 2), "lowpass", 9000, 2)
    echo = filt(pingpong(sends["delay"].x), "highpass", 300, 2)

    out = dry + wet * db(-9.0) + echo * db(-12.0)
    out = filt(out, "highpass", 26, 2)
    out = out[:N]

    # Fades: a click-free start, and the end card's tail tucked in before 25 s.
    t = times(N)
    out *= np.clip(t / 0.01, 0, 1)[:, None]
    fade = np.clip((DURATION - t) / 0.9, 0, 1)
    out *= (0.5 - 0.5 * np.cos(np.pi * fade))[:, None]

    out = glue(out)
    target = -14.0
    for _ in range(3):
        gain = target - lufs(out)
        out = limit(out * db(gain), -1.3)
    if true_peak_db(out) > -1.0:
        out = limit(out, -1.0 - (true_peak_db(out) + 1.0) - 1.3)
    return out


def write_wav(path, x):
    from scipy.io import wavfile

    pcm = np.clip(x, -1, 1)
    wavfile.write(path, SR, (pcm * 32767).astype(np.int16))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    buses, sends, ir, kicks, cues = compose()
    master = mix(buses, sends, ir, kicks)
    write_wav(OUT / "soundtrack.wav", master)
    stats = {
        "duration_s": DURATION,
        "bpm": BPM,
        "key": "D major",
        "integrated_lufs": round(lufs(master), 2),
        "true_peak_dbtp": round(true_peak_db(master), 2),
        "cues": [{"t": round(t, 4), "label": label} for t, label in sorted(cues)],
    }
    (OUT / "soundtrack.json").write_text(json.dumps(stats, indent=2) + "\n")
    print(json.dumps({k: v for k, v in stats.items() if k != "cues"}, indent=2))


if __name__ == "__main__":
    main()
