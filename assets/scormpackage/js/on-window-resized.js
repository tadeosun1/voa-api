let timeOutFunctionId;
let unityContainerSizeReference;
let unityContainer;
let appWrapper;

function updateAppDimensions() {
  if (unityContainer == null) {
    unityContainer = document.getElementById('unity-container');
  }
  if (unityContainerSizeReference == null) {
    unityContainerSizeReference = document.getElementById('unity-container-size-reference');
  }

  const referenceWidth = unityContainerSizeReference.offsetWidth;
  const clampedWidth = Math.max(referenceWidth, minWidth);

  const referenceHeight = unityContainerSizeReference.offsetHeight;
  const clampedHeight = Math.max(referenceHeight, minHeight);

  unityContainer.style.width = `${clampedWidth}px`;
  unityContainer.style.height = `${clampedHeight}px`;
}

window.addEventListener('load', () => {
  updateAppDimensions();
});

function allowAppScrollbars() {
  if (appWrapper == null) {
    appWrapper = document.getElementById('app-wrapper');
  }
  appWrapper.style.overflow = 'auto';
}

function hideAppScrollbars() {
  if (appWrapper == null) {
    appWrapper = document.getElementById('app-wrapper');
  }
  appWrapper.style.overflow = 'hidden';
}

function afterWindowResize() {
  updateAppDimensions();
  allowAppScrollbars();
}

window.addEventListener('resize', () => {
  hideAppScrollbars();

  clearTimeout(timeOutFunctionId);
  timeOutFunctionId = setTimeout(afterWindowResize, resizeDelay);
});
