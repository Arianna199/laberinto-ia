AFRAME.registerComponent("maze-generator", {
  init: function () {
    const sceneEl = document.querySelector("a-scene");
    const maze = [
      "1111111",
      "1     1",
      "1 111 1",
      "1 1   1",
      "1 1 1 1",
      "1   1E1",
      "1111111",
    ];

    for (let z = 0; z < maze.length; z++) {
      for (let x = 0; x < maze[z].length; x++) {
        const tile = maze[z][x];
        if (tile === "1") {
          const wall = document.createElement("a-box");
          wall.setAttribute("position", `${x} 0.5 ${-z}`);
          wall.setAttribute("depth", 1);
          wall.setAttribute("height", 1);
          wall.setAttribute("width", 1);
          wall.setAttribute("color", "#4CC3D9");
          wall.setAttribute("class", "wall");
          sceneEl.appendChild(wall);
        } else if (tile === "E") {
          const end = document.createElement("a-box");
          end.setAttribute("position", `${x} 0.5 ${-z}`);
          end.setAttribute("depth", 1);
          end.setAttribute("height", 1);
          end.setAttribute("width", 1);
          end.setAttribute("color", "green");
          end.setAttribute("id", "goal");
          sceneEl.appendChild(end);
        }
      }
    }
  },
});

document.querySelector("a-scene").setAttribute("maze-generator", "");
