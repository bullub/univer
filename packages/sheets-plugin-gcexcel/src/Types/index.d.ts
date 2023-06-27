/// <reference types="vite/client" />

export * from '../index';
declare module '@univerjs/sheets-plugin-gcexcel' {}

// use css module
declare module '*.less' {
    const resource: { [key: string]: string };
    export = resource;
}
