export type SelectionState = { id: string; revision: number; modelLabel: string; correction: string };
export type LabelResponse = { selectionId: string; requestRevision: number; label: string };
export function correctSelection(state: SelectionState, label: string): SelectionState {
  return { ...state, revision: state.revision + 1, correction: label };
}
export function receiveLabel(state: SelectionState, response: LabelResponse) {
  const accepted = response.selectionId === state.id && response.requestRevision === state.revision && !state.correction;
  return { accepted, state: accepted ? { ...state, modelLabel: response.label } : state };
}
