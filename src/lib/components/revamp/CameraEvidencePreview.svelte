<script lang="ts">
  const captures = [
    {
      id: 'current-camera-off',
      label: 'Current',
      result: 'Current interface · Camera off',
      detail:
        'This public-safe capture establishes the current product structure and lifecycle controls. It does not demonstrate recognition accuracy.',
      src: '/projects/camera-harness/current-camera-off.png',
      width: 1440,
      height: 900,
      objectPosition: 'center top',
      alt: 'Current Camera Harness interface with the camera off and readiness controls visible.'
    },
    {
      id: 'historical-sensefield',
      label: 'Historical',
      result: 'Historical Sensefield surface · Camera off',
      detail:
        'This surface records an earlier integration direction. Sensefield is not mounted in the current product.',
      src: '/projects/camera-harness/historical-sensefield-camera-off.png',
      width: 1440,
      height: 900,
      objectPosition: 'center top',
      alt: 'Historical Sensefield interface with the camera off and no raw media stored label visible.'
    }
  ];

  let activeIndex = 0;

  $: activeCapture = captures[activeIndex];
</script>

<figure class="camera-evidence">
  <div class="evidence-heading">
    <p>Public-safe interface evidence</p>
    <div class="capture-switcher" role="group" aria-label="Choose runtime capture">
      {#each captures as capture, index}
        <button
          type="button"
          aria-pressed={activeIndex === index}
          on:click={() => (activeIndex = index)}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          {capture.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="capture-stage">
    {#key activeCapture.id}
      <img
        src={activeCapture.src}
        alt={activeCapture.alt}
        width={activeCapture.width}
        height={activeCapture.height}
        style={`object-position: ${activeCapture.objectPosition}`}
        loading="lazy"
        decoding="async"
      />
    {/key}
  </div>

  <figcaption>
    <strong>{activeCapture.result}</strong>
    <p>{activeCapture.detail}</p>
    <p>
      These captures intentionally omit live runtime frames, people, and private environments.
    </p>
  </figcaption>
</figure>

<style>
  .camera-evidence {
    display: grid;
    grid-column: 1 / -1;
    gap: 0.9rem;
    width: min(100%, 52rem);
    margin: clamp(2.5rem, 5vw, 5rem) auto 0;
  }

  .evidence-heading {
    display: flex;
    min-height: 2.75rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-block: 1px solid rgb(244 234 220 / 0.16);
  }

  .evidence-heading p {
    margin: 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 780;
    letter-spacing: 0.12em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  .capture-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    justify-content: flex-end;
  }

  .capture-switcher button {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    gap: 0.55rem;
    border: 1px solid rgb(244 234 220 / 0.18);
    border-radius: 0.2rem;
    background: transparent;
    color: rgb(244 234 220 / 0.62);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 760;
    letter-spacing: 0.08em;
    padding-inline: 0.8rem;
    text-transform: uppercase;
  }

  .capture-switcher button span {
    color: var(--accent);
  }

  .capture-switcher button:hover,
  .capture-switcher button:focus-visible,
  .capture-switcher button[aria-pressed='true'] {
    border-color: rgb(232 168 120 / 0.72);
    background: var(--foreground);
    color: #050505;
    outline: none;
  }

  .capture-switcher button[aria-pressed='true'] span {
    color: #6f3b20;
  }

  .capture-switcher button:focus-visible {
    box-shadow: 0 0 0 3px var(--ring);
  }

  .capture-stage {
    width: 100%;
    overflow: hidden;
    aspect-ratio: 2254 / 1114;
    background: #0a0a0a;
  }

  .capture-stage img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center top;
    animation: capture-in 220ms var(--interaction-ease);
  }

  figcaption {
    display: grid;
    grid-template-columns: minmax(12rem, 0.7fr) minmax(0, 1fr) minmax(18rem, 0.9fr);
    gap: clamp(1rem, 3vw, 2.5rem);
    padding-top: 0.25rem;
  }

  figcaption strong {
    color: rgb(244 234 220 / 0.86);
    font-size: 0.9rem;
    line-height: 1.45;
  }

  figcaption p {
    margin: 0;
    color: rgb(244 234 220 / 0.6);
    font-size: 0.86rem;
    line-height: 1.55;
  }

  @keyframes capture-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 760px) {
    .camera-evidence {
      width: 100%;
    }

    .evidence-heading {
      align-items: flex-start;
      flex-direction: column;
      padding-block: 0.75rem;
    }

    .evidence-heading p {
      max-width: 16rem;
    }

    .capture-switcher {
      width: 100%;
      flex-wrap: nowrap;
      justify-content: flex-start;
    }

    .capture-switcher button {
      flex: 1;
      justify-content: center;
      padding-inline: 0.6rem;
    }

    figcaption {
      grid-template-columns: 1fr;
      gap: 0.7rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .capture-stage img {
      animation: none;
    }
  }
</style>
