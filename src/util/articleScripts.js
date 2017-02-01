export const updateIFrameDimensions = () => {
  document.querySelectorAll('.article__oembed iframe')
    .forEach((el) => {
      const iframe = el;
      const parentWidth = iframe.parentNode.clientWidth;
      const newHeight = (iframe.clientHeight * parentWidth) / iframe.clientWidth;
      iframe.height = newHeight;
      iframe.width = parentWidth;
    });
};
export const addAsideClickListener = () => {
  document.querySelectorAll('.c-article aside > div')
    .forEach((el) => {
      const target = el;
      target.onclick = () => target.classList.toggle('expanded');
    });
};
export const removeAsideClickListener = () => {
  document.querySelectorAll('.c-article aside > div')
    .forEach((el) => {
      const target = el;
      target.onclick = undefined;
    });
};

export const addEventListenerForResize = () => {
  window.addEventListener('resize', updateIFrameDimensions);
};

export const removeEventListenerForResize = () => {
  window.removeEventListener('resize', updateIFrameDimensions);
};
