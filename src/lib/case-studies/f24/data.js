const SITS = [
  {id:'', tab:'The mockup', t:'The mockup', see:'A tidy form with two fields and a Save button.', built:'Mostly layout. This is where a design file usually stops.', hot:null},
  {id:'loading', tab:'Loading', t:'Still loading', see:'A soft placeholder where the contact list will appear, and a note saying it is on its way.', built:'Space held for the data, so nothing jumps when it arrives.', hot:'[data-f="rec"]'},
  {id:'validation', tab:'Missing info', t:'Something is missing', see:'The empty field is outlined and says exactly what to fix.', built:'Checks that point at the right field, in plain words.', hot:'[data-f="scen"]'},
  {id:'permissions', tab:'View only', t:'View-only access', see:'Save is greyed out, with the reason written underneath.', built:'Controls that know who is looking, and say why.', hot:'.m-perm'},
  {id:'api', tab:'Long list', t:'A very long list', see:'The first 20 of 140 contacts, a count, and a way to load more.', built:'Paging that keeps your choices while more arrive.', hot:'[data-f="rec"]'},
  {id:'testrun', tab:'Test run', t:'Checking before saving', see:'A preview of who would be notified. Nothing is sent.', built:'A test run with its own result, kept apart from your edits.', hot:'.m-test'},
  {id:'recovery', tab:'Save failed', t:'Saving failed', see:'A calm message at the top, a Retry button, and your work still there.', built:'Recovery that never throws away what someone typed.', hot:'.m-banner'},
  {id:'responsive', tab:'On a phone', t:'On a phone', see:'The fields stack so everything still fits and reads well.', built:'One layout that adapts, not a second app.', hot:'ALL'},
  {id:'tests', tab:'Tests', t:'Behind the scenes', see:'Small tags mark what automated tests check every time.', built:'Tests that click, wait and verify like a person would.', hot:null}
];
const LOG = [
  {t:'09:42', scen:'Site closure', iface:'SMS', rec:'Team A', st:'Delivered', id:'Contact 1'},
  {t:'09:40', scen:'Power outage', iface:'Email', rec:'Team B', st:'Delivered', id:'Contact 2'},
  {t:'09:31', scen:'Practice drill', iface:'SMS', rec:'Team C', st:'Failed', id:'Contact 3', cause:'Example reason, invented for this page.'},
  {t:'09:12', scen:'Site closure', iface:'App', rec:'Team D', st:'Delivered', id:'Contact 4'},
  {t:'08:58', scen:'Power outage', iface:'SMS', rec:'Team E', st:'Failed', id:'Contact 5', cause:'Example reason, invented for this page.'},
  {t:'08:44', scen:'Practice drill', iface:'Email', rec:'Team F', st:'Delivered', id:'Contact 6'},
  {t:'08:20', scen:'Site closure', iface:'SMS', rec:'Team G', st:'Delivered', id:'Contact 7'},
  {t:'07:55', scen:'Power outage', iface:'App', rec:'Team A', st:'Delivered', id:'Contact 1'}
];
const STATES = [{id:'success', name:'Success'}, {id:'loading', name:'Loading'}, {id:'empty', name:'Empty'}, {id:'partial', name:'Partial'}, {id:'error', name:'Error'}, {id:'denied', name:'No permission'}, {id:'stale', name:'Stale'}];
const QP = [
  {t:'Where it asks', d:'The same address on the server.', deps:['count', 'contacts', 'list']},
  {t:'Whose data', d:'The same workspace and the same contacts.', deps:['count', 'contacts', 'list']},
  {t:'How much, in what order', d:'The same page size and sort order.', deps:['count', 'list']},
  {t:'The shape of the answer', d:'The same fields, read the same way.', deps:['contacts', 'list']},
  {t:'What it remembers', d:'No stale answer kept from before.', deps:['count', 'list']}
];
const FOUND = ['Sign-in', 'Sessions', 'Page routing', 'Layout', 'Navigation', 'App-wide settings', 'Colours and type', 'Shared assets', 'Build and release setup'];
const SVF = ['Feature screens', 'Forms', 'Lists and tables', 'Detail views', 'History views', 'Settings'];
const RXF = ['New features', 'Rebuilt screens'];
const ESTAGES = [
  {tab:'Single source of truth', k:'Step 1 of 3', t:'One codebase, one source of truth.', p:'At first, everything lived in a single Svelte codebase: the screens people use, and the parts every screen needs, such as sign-in, navigation, layout and styling. That works well, until a second technology has to share the same product.', note:'one codebase'},
  {tab:'A shared foundation', k:'Step 2 of 3', t:'Pull out what every screen needs.', p:'Sign-in, navigation, layout, styling and the build setup moved into one shared foundation with a single owner. The screens keep their own logic. Nothing changes for the people using the product.', note:'screens only'},
  {tab:'Two stacks, one product', k:'Step 3 of 3', t:'New work joins without a pause.', p:'New features are built in React on the same foundation, while the Svelte screens keep shipping. The goal is one consistent product: same look, same behaviour, same accessibility, on every screen.', note:'still shipping'}
];
const DEC = [
  {t:'Keep state separate by kind.', l:['feature', 'components'], c:'Configuration workflows keep growing, and boundaries blur fast when one component owns everything.', d:'Each feature holds its own view, form, async and permission state. Reusable components sit below it, and an API and domain layer below those.', r:'The same inputs, dropdowns, pagination, labels and feedback states serve many workflows.'},
  {t:'Design every async state, not just success.', l:['feature', 'api'], c:'A mockup shows success. Production also has idle, loading, partial, empty, validation error, server error, retry, changed context and stale data.', d:'Each workflow models those states explicitly, so the screen is predictable in all of them.', r:'Operators get fewer surprises, and every state is a target a test can name.'},
  {t:'Upstream changes invalidate downstream choices.', l:['feature', 'api'], c:'Earlier choices decide which later options exist, and the configuration depends on all of them.', d:'When an upstream selection changes, dependent selections are checked and cleared if they no longer apply.', r:'A stale selection can never survive into a saved configuration.'},
  {t:'A test run is its own state.', l:['feature', 'api', 'services'], c:'The configuration being edited, the one submitted for a test and the result on screen can all differ.', d:'Treat them as separate truths, so an old result is never mistaken for the current configuration.', r:'People check behaviour before saving instead of configuring and hoping.'},
  {t:'A shared shell owns the platform.', l:['shell', 'route'], c:'Two frontend stacks need one consistent product: auth, session, routing, layout, navigation, providers, tokens, assets and build conventions.', d:'Move those into a shared app shell. Product features own their domain behaviour.', r:'Every concern has one owner, which keeps features from coupling across projects.'},
  {t:'Migrate behaviour, not pixels.', l:['api', 'services', 'components'], c:'A migrated screen rendered correctly and showed no data.', d:'Prove the old request contract equals the new one: address, scope, paging, ordering, response shape, field mapping and caching.', r:'Parity is checked at runtime, not by eye.'},
  {t:'Test consequences, not components.', l:['tests'], c:'A click that looks right can still fire twice, send the wrong data or lose focus.', d:'Playwright covers critical user flows end to end, including accessibility, persisted state and degraded networks.', r:'The tests describe what the product promises, so refactors stay safe.'}
];
const NETS = [{id:'normal', name:'Normal'}, {id:'slow', name:'Slow'}, {id:'offline', name:'Offline'}];
const ASSERTS = [
  ['once', 'Request fired once', 'expect(requests).toBe(1)'],
  ['sent', 'Sends what the form shows', 'expect(sent).toEqual(form)'],
  ['disabled', 'Save disabled while pending', 'toBeDisabled()'],
  ['error', 'Error shown inline, form kept', 'offline only'],
  ['persist', 'Saved state matches the server', 'online only'],
  ['focus', 'Focus returns to Save', 'toBeFocused()']
];

export {SITS,LOG,STATES,QP,FOUND,SVF,RXF,ESTAGES,DEC,NETS,ASSERTS};
