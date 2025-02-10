<template>
  <div class="app-container">
    <NavBar />
    
    <div class="controls">
      <button @click="addNode" class="btn">➕ Add Node</button>
      <button @click="removeNode" class="btn">❌ Remove Node</button>
      
      <input v-model.number="insertIndex" type="number" placeholder="Index" class="input-box"/>
      <button @click="addNodeAtIndex(insertIndex)" class="btn">📥 Insert At Index</button>

      <input v-model.number="deleteIndex" type="number" placeholder="Index" class="input-box"/>
      <button @click="removeNodeAtIndex(deleteIndex)" class="btn">🗑️ Remove At Index</button>
    </div>

    <div class="scroll-container">
      <svg ref="svgContainer"></svg>
    </div>

    <footer class="app-footer">
      <p>© 2025 Linked List Visualizer. All rights reserved.</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import NavBar from "./partials/NavBar.vue";

interface NodeData {
  id: number;
  label: string;
}

export default {
    components: {
    NavBar,
  },
  setup() {
    const svgContainer = ref<SVGElement | null>(null);
    let data: NodeData[] = [];
    let nextId = 1;
    const nodeRadius = 35;
    const gap = 180;
    const baseWidth = 200;
    const height = 250;

    const insertIndex = ref<number>(0);
    const deleteIndex = ref<number>(0);

    onMounted(() => {
      draw();
    });

    function draw() {
      if (!svgContainer.value) return;

      const svg = d3.select(svgContainer.value).style("background", "#121212");

      svg.append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 30)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0,-5 L 10,0 L 0,5")
        .attr("fill", "#ffffff");

      function update() {
        const displayData = [...data, { id: -1, label: "Null" }];
        
        const svgWidth = Math.max(baseWidth + displayData.length * gap, window.innerWidth * 0.9);
        svg.attr("width", svgWidth).attr("height", height);

        const nodes = svg.selectAll(".node-group").data(displayData, (d: any) => d.id);
        const newNodes = nodes.enter().append("g").attr("class", "node-group");

        newNodes.append("circle")
          .attr("r", nodeRadius)
          .attr("fill", d => d.label === "Null" ? "#e74c3c" : "#3498db")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 3);

        newNodes.append("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .attr("fill", "#ffffff")
          .attr("font-size", "16px")
          .text(d => d.label);

        const links = svg.selectAll(".link").data(displayData.slice(0, -1), (d: any) => d.id);
        links.enter()
          .append("line")
          .attr("class", "link")
          .attr("stroke", "#555")
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrowhead)")
          .merge(links)
          .transition()
          .duration(800)
          .attr("x1", (d, i) => i * gap + nodeRadius + 44)
          .attr("y1", height / 2)
          .attr("x2", (d, i) => (i + 1) * gap - nodeRadius + 41)
          .attr("y2", height / 2);

        links.exit().remove();

        nodes.merge(newNodes)
          .transition()
          .duration(800)
          .attr("transform", (d, i) => `translate(${i * gap + 8 + nodeRadius}, ${height / 2})`);

        nodes.exit().remove();
      }

      update();

      function highlightTraversal(index: number, callback: Function) {
        let i = 0;

        function step() {
          if (i > index) {
            callback();
            return;
          }

          d3.selectAll(".node-group circle")
            .transition()
            .duration(500)
            .attr("fill", (d, j) => (j === i ? "#f1c40f" : d.label === "Null" ? "#e74c3c" : "#3498db"));

          i++;
          setTimeout(step, 600);
        }

        step();
      }


      window.addNode = () => {
        const label = `Node ${String.fromCharCode(65 + data.length)}`;
        data.push({ id: nextId++, label });
        update();
      };

      window.removeNode = () => {
        data.pop();
        update();
      };

      window.addNodeAtIndex = (index: number) => {
        if (index < 0 || index > data.length) {
          alert("Invalid index!"); 
          return;
        }
        highlightTraversal(index, () => {
          const label = `Node ${String.fromCharCode(65 + data.length)}`;
          data.splice(index, 0, { id: nextId++, label });
          update();
        });
      };

      window.removeNodeAtIndex = (index: number) => {
        if (index < 0 || index >= data.length) {
          alert("Invalid index!"); 
          return;
        }
         highlightTraversal(index, () => {
          data.splice(index, 1);
          update();
        });
      };
    }

    return {
      svgContainer,
      insertIndex,
      deleteIndex,
      addNode: () => window.addNode(),
      removeNode: () => window.removeNode(),
      addNodeAtIndex: (index: number) => window.addNodeAtIndex(index),
      removeNodeAtIndex: (index: number) => window.removeNodeAtIndex(index),
    };
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Prevent horizontal scroll */
  background: #121212; /* Ensure full black background */
}
html, body, .app-container {
  height: 100%;
}
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh; /* Ensure full height */
  background: #121212;
  color: white;
  margin: 0; /* Remove any extra margins */
  padding: 0;
}
.app-header, .app-footer {
  width: 100%;
  text-align: center;
  padding: 15px 0;
  background: #1e1e1e;
  margin: 0; /* Remove any margin */
}
nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}
.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.input-box {
  padding: 8px;
  width: 80px;
  border-radius: 5px;
  border: none;
  text-align: center;
  font-size: 16px;
}
.btn {
  background: #6200ea;
  color: white;
  font-size: 16px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #3700b3;
}

.scroll-container {
  width: 100%;
  max-width: 95vw;
  overflow-x: auto;
  padding: 0; /* Remove padding */
  margin: 0 auto; /* Center it */
  background: #1e1e1e;
  border-radius: 10px;
}

svg {
  display: block;
  margin: 0 auto; /* Ensure no extra space */
  height: auto;
}
</style>
