export const Content = () => {
  return (
    <>
      <div>Content</div>
      <button
        onClick={() => {
          window.api.setLayout("fullscreen");
        }}
      >
        Set Fullscreen Layout
      </button>
      <button
        onClick={() => {
          window.api.setLayout("default");
        }}
      >
        Set Default Layout
      </button>
    </>
  );
};
