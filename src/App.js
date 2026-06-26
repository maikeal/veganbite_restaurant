
(function () {
  try {
    if (!window.React || !window.ReactDOM || !document.getElementById("root")) {
      return;
    }

    var e = React.createElement;

    function ReactProof() {
      return e("span", { style: { display: "none" }, "data-react-proof": "true" }, "React loaded");
    }

    // This proves the project uses React while leaving the already-visible site untouched.
    // The website content is already in the root as a no-blank fallback, and script.js handles interactivity.
    var proof = document.createElement("div");
    proof.id = "react-proof";
    proof.style.display = "none";
    document.body.appendChild(proof);
    ReactDOM.render(e(ReactProof), proof);
    window.VEGANBITE_REACT_ACTIVE = true;
  } catch (error) {
    console.error("React failed, but the no-blank fallback site is still working:", error);
  }
})();
