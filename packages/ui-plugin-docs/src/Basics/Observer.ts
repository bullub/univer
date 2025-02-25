import { Observable } from '@univerjs/core';
import { DocUIPlugin } from '../DocUIPlugin';
import { DocContainer } from '../View';

export type DocUIPluginObserve = {
    onUIDidMount: Observable<DocContainer>;
};

export function uninstallObserver(plugin: DocUIPlugin) {
    plugin.deleteObserve('onUIDidMount');
}

export function installObserver(plugin: DocUIPlugin) {
    plugin.pushToObserve('onUIDidMount');
}
