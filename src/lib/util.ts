export const elementTopInView = (el: HTMLElement) => el.getBoundingClientRect().top <=(window.innerHeight || document.documentElement.clientHeight)
