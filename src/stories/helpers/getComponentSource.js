export function getBoxComponent(text, nested = false) {

  let html = "";
  if (!nested) {
    html += `<script>
  import Nested from "./Nested.svelte";
</script>\n\n`;
  }

  html += `<div class="box">\n  <span class="${nested ? 'nested' : ''}">${text}</span>\n</div>\n`;
  if (!nested) {
    html += '<Nested />\n';
  }
  html += `
<style>
  .box {
    width: 450px;
    height: 170px;
    background: cornflowerblue;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.3rem;
    margin: 0.5rem;
  }
</style>
`;

  return html;
}