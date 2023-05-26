import React from "react";

function Frame({ name, src }) {
  return (
    <div>
      <p>{name}</p>
      {src ? (
        <iframe
          src={src}
          width={1000}
          height={500}
          // sandbox="allow-scripts allow-modal"
          loading="lazy"
          title="Custom title"
        ></iframe>
      ) : (
        <h1>access denied</h1>
      )}
    </div>
  );
}

export default Frame;
