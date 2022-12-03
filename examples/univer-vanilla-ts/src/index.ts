import { IDocumentData, ISlideData, IWorkbookConfig, UniverDoc, UniverSheet, UniverSlide } from '@univer/core';
import * as UniverCore from '@univer/core'
import { RenderEngine } from '@univer/base-render';
import { UniverComponentSheet } from '@univer/style-universheet';
import { ISheetPluginConfig, SheetPlugin } from '@univer/base-sheets';
import { IDocPluginConfig, DocPlugin } from '@univer/base-docs';
import { ISlidePluginConfig, SlidePlugin } from '@univer/base-slides';
import { DEFAULT_WORKBOOK_DATA } from '@univer/common-plugin-data';

interface ISheetPropsCustom {
    coreConfig?: Partial<IWorkbookConfig>;
    baseSheetsConfig?: ISheetPluginConfig;
}

/**
 * Initialize the core and all plugins
 */
class UniverSheetCustom {
    constructor() {}
    init(config: ISheetPropsCustom = {}): UniverSheet {
        const universheet = UniverSheet.newInstance(config.coreConfig);

        universheet.installPlugin(new RenderEngine());
        universheet.installPlugin(new UniverComponentSheet());
        universheet.installPlugin(new SheetPlugin(config.baseSheetsConfig));

        return universheet;
    }
}
/**
 * Wrapped into a function,easy to use
 * @param config
 * @returns
 */
const univerSheetCustom = function (config?: ISheetPropsCustom) {
    return new UniverSheetCustom().init(config);
};

interface IDocPropsCustom {
    coreConfig?: Partial<IDocumentData>;
    baseDocsConfig?: IDocPluginConfig;
}

/**
 * Initialize the core and all plugins
 */
class UniverDocCustom {
    constructor() {}
    init(config: IDocPropsCustom = {}): UniverDoc {
        const univerdoc = UniverDoc.newInstance(config.coreConfig);

        univerdoc.installPlugin(new RenderEngine());
        univerdoc.installPlugin(new UniverComponentSheet());
        univerdoc.installPlugin(new DocPlugin(config.baseDocsConfig));

        return univerdoc;
    }
}
/**
 * Wrapped into a function,easy to use
 * @param config
 * @returns
 */
const univerDocCustom = function (config?: IDocPropsCustom) {
    return new UniverDocCustom().init(config);
};

interface ISlidePropsCustom {
    coreConfig?: Partial<ISlideData>;
    baseSlidesConfig?: ISlidePluginConfig;
}

/**
 * Initialize the core and all plugins
 */
class UniverSlideCustom {
    constructor() {}
    init(config: ISlidePropsCustom = {}): UniverSlide {
        const universlide = UniverSlide.newInstance(config.coreConfig);

        universlide.installPlugin(new RenderEngine());
        universlide.installPlugin(new UniverComponentSheet());
        universlide.installPlugin(new SlidePlugin(config.baseSlidesConfig));

        return universlide;
    }
}
/**
 * Wrapped into a function,easy to use
 * @param config
 * @returns
 */
const univerSlideCustom = function (config?: ISlidePropsCustom) {
    return new UniverSlideCustom().init(config);
};

export {UniverCore, univerSheetCustom,univerDocCustom,univerSlideCustom, DEFAULT_WORKBOOK_DATA };
