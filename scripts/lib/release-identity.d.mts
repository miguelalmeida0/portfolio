export type BuildInfo = {schemaVersion: number; commit: string; builtAt: string; dirty: boolean};
export function buildIdentity(input: {sha:string;dirty:boolean;now?:Date;deploymentSha?:string}): BuildInfo;
export function currentBuildIdentity(reuse?: boolean): BuildInfo;
export function assertPromotion(input: {head:string;test:string;dirty:boolean;proof:unknown}): void;
