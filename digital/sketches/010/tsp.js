//https://observablehq.com/@oscarlvp/tsp-art
function* solveTSP(cities) {
    const ESPILON = -0.001;
      
      function distSquared(x1, y1, x2, y2) {
          let dx = x2 - x1;
          let dy = y2 - y1;
          return dx * dx + dy * dy;
      }
  
    let distances = (() => {
      let result = [];
      for (let i = 0; i < cities.length; i++) {
        let row = new Float32Array(cities.length);
        for (let j = 0; j < cities.length; j++) {
          row[j] = distSquared(cities[i].x, cities[i].y, cities[j].x,cities[j].y);
          //row[j] = dist(cities[i].x, cities[i].y, cities[j].x,cities[j].y);
        }
        result.push(row);
      }
      return result;
    })();
  
    function firstTwoOptImprovement(tour) {
      const next = current => (current + 1) % tour.length;
      const pick = () => floor(random(tour.length - 2));
  
      function delta(i, j) {
        let ni = tour[next(i)];
        let nj = tour[next(j)];
        let ci = tour[i];
        let cj = tour[j];
        return (
          distances[ci][cj] +
          distances[ni][nj] -
          distances[ci][ni] -
          distances[cj][nj]
        );
      }
  
      function move(from, to) {
        let result = [...tour];
        let count = to - from;
        for (let i = 0; i < count; i++) {
          result[from + 1 + i] = tour[to - i];
        }
        return result;
      }
  
      for (
        let times = 0, start = pick();
        times < tour.length;
        times++, start = next(start)
      ) {
        for (let end = start + 2; end < tour.length; end++) {
          let variation = delta(start, end);
          if (variation < ESPILON) {
            return { tour: move(start, end), delta: variation };
          }
        }
      }
      return { tour: tour, delta: 0 };
    }
  
      var rand = Array.from(Array(cities.length).keys())
    let current = { tour: rand, delta: Number.MIN_SAFE_INTEGER };
    // yield current.tour;
       //console.log("delta " + current.delta);
    while (current.delta < 0) {
      yield current.tour;
      current = firstTwoOptImprovement(current.tour);
    }
  }