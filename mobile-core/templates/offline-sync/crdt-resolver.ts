import * as Y from 'yjs';

/**
 * Mobile Offline First CRDT Synchronization
 */
export class OfflineResolver {
    private doc: Y.Doc;
    private stateMap: Y.Map<any>;

    constructor() {
        this.doc = new Y.Doc();
        this.stateMap = this.doc.getMap('axiom-state');
    }

    updateLocalState(key: string, value: any) {
        this.stateMap.set(key, value);
    }

    // Triggered upon reconnection via '../../scripts/telemetry-analyzer.js' heartbeat
    syncWithServer(serverStateDiff: Uint8Array) {
        Y.applyUpdate(this.doc, serverStateDiff);
        return Y.encodeStateAsUpdate(this.doc);
    }
}
