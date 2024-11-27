//导入CSS
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}
