/**
 * Canvallax parallax sky — adapted from climate-house (Canvallax.js demo).
 * Runs only on body.page--sky.
 */
(function () {
  'use strict';

  if (!document.body || !document.body.classList.contains('page--sky')) {
    return;
  }

  if (typeof Canvallax === 'undefined' || !Canvallax) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('page--sky-static');
    return;
  }

  var can = Canvallax({
    className: 'bg-canvas',
    damping: 40,
    parent: document.body
  });

  var width = window.innerWidth || document.documentElement.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight;
  var origWidth = width;
  var origHeight = height;

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var gradient = Canvallax.Rectangle({
    width: width * 1.5,
    height: height * 1.1,
    zIndex: 1,
    fill: (function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, '#07588A');
      g.addColorStop(1, '#E1F6F4');
      return g;
    })()
  });

  can.add(gradient);

  var stars = [];
  var number = 300;
  var i = 0;
  var distance;

  for (; i < number; i++) {
    distance = randomRange(0.1, 0.3);
    stars.push(
      Canvallax.Circle({
        x: Math.random() * width,
        y: Math.random() * height * 0.9,
        distance: distance,
        size: 4,
        fill: '#FFF'
      })
    );
  }

  can.add(stars);

  window.addEventListener('resize', function () {
    height = window.innerHeight || document.documentElement.clientHeight;
    width = window.innerWidth || document.documentElement.clientWidth;

    var ei = can.elements.length;
    var max = width;
    var heightScale = height / origHeight;

    while (ei--) {
      can.elements[ei].maxX = max;
      can.elements[ei].origY = can.elements[ei].origY || can.elements[ei].y;
      can.elements[ei].y = can.elements[ei].origY * heightScale;
    }
  });

  function bestCandidateSampler(sampleWidth, sampleHeight, numCandidates) {
    var samples = [];

    function findDistance(a, b) {
      var dx = a[0] - b[0];
      var dy = a[1] - b[1];
      return dx * dx + dy * dy;
    }

    function findClosest(c) {
      var si = samples.length;
      var sample;
      var closest;
      var dist;
      var closestDistance;

      while (si--) {
        sample = samples[si];
        dist = findDistance(sample, c);
        if (!closestDistance || dist < closestDistance) {
          closest = sample;
          closestDistance = dist;
        }
      }

      return closest;
    }

    function getSample() {
      var bestCandidate;
      var bestDistance = 0;
      var ci = 0;
      var c;
      var d;

      c = [Math.random() * sampleWidth, Math.random() * sampleHeight];

      if (samples.length < 1) {
        bestCandidate = c;
      } else {
        for (; ci < numCandidates; ci++) {
          c = [Math.random() * sampleWidth, Math.random() * sampleHeight];
          d = findDistance(findClosest(c), c);
          if (d > bestDistance) {
            bestDistance = d;
            bestCandidate = c;
          }
        }
      }

      samples.push(bestCandidate);
      return bestCandidate;
    }

    getSample.all = function () {
      return samples;
    };
    getSample.samples = samples;

    return getSample;
  }

  var getCandidate = bestCandidateSampler(width, height, 10);
  var CLOUD_WIDTH = 510;
  var CLOUD_HEIGHT = 260;
  var CLOUD_COUNT = Math.floor((width * height) / (CLOUD_WIDTH * CLOUD_HEIGHT));

  function randomizedCloud(image) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var cWidth = (canvas.width = randomRange(400, 700));
    var cHeight = (canvas.height = randomRange(200, 260));
    var w = image.width;
    var h = image.height;
    var halfw = w / 2;
    var halfh = h / 2;
    var ni = Math.ceil(randomRange(20, 90));
    var randScale;
    var maxScale = 2.5;
    var fullPi = Math.PI / 2;

    while (ni--) {
      randScale = randomRange(0.4, maxScale);
      ctx.globalAlpha = Math.random() - 0.2;
      ctx.translate(
        randomRange(halfw, cWidth - w * maxScale * 1.3),
        randomRange(halfh + halfh / 4, cHeight - h * maxScale)
      );
      ctx.scale(randScale, randomRange(randScale - 0.3, randScale));
      ctx.translate(halfw, halfh);
      ctx.rotate(randomRange(0, fullPi));
      ctx.drawImage(image, -halfw, -halfh);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    return canvas;
  }

  var cloudImg = new Image();

  cloudImg.addEventListener('load', function () {
    var ci = CLOUD_COUNT;
    var rand;
    var pos;
    var tex;
    var cloud;

    while (ci--) {
      rand = randomRange(0.4, 1.2);
      pos = getCandidate();
      tex = randomizedCloud(cloudImg);

      cloud = Canvallax.Image({
        image: tex,
        width: tex.width,
        height: tex.height,
        zIndex: rand * 13,
        x: pos[0],
        y: pos[1],
        opacity: rand < 0.8 ? 0.8 : rand,
        distance: rand,
        maxX: width,
        speed: rand * randomRange(0.2, 0.4),
        postRender: function () {
          this.x =
            this.x * this.distance > -this.width
              ? this.x - this.speed
              : this.maxX + this.width * 2;
        }
      });

      can.add(cloud);
    }

    can.render();
  });

  cloudImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAAYFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8GYpHzAAAAIHRSTlMAAwcLDxIWGh8kKzI5QEhPVl9qc3uEi5Sdpa64wcrV4c6KdP8AAAOeSURBVHgBndQJkvM8DoNhS+nv/ieONBH8FIs1nb83ZLfF1wBFZ17vNMZ8fPz79/GY46Xre8F85kRzzhdk/A2TOpSARpF/g0mdaI8XZjg47leA32Jo3wbEooNE/SFGrPOAiPxC+xaDAxBTxQqFoW8wGGof89E4j8nQUceo621h/KY8GuXx4Mg10vRZlPd55JCEnXlIQX7cE8pNp8Dob4oY8LjZTny8QEMo2o2hSqT5YImxchVNbpgZ3oVR4xVUgOlGS5fFKCPSWDY4Yu1xIKyEEqLfE0UUKcoJ9MFVsAhnaOpEGW4gyxFyLitOeRhZO8NJur1hKpWWCV03oaG9yYcYXvD7UPbetVOMNwqlWH6/b7sp29G1Z5g6LFGaY9uYB2A6M7evtVco3U3M1CCopOlNY8Q7cdZahxIMTpv7meR2NghWDqdu8MTZzwMqN+RaBkmdUgf7wMfN1d1cNSAFMdhQ3tLXu2STuclylwYL5QYhsGyLz499bcgxK1F5SmumvaoRrIwSjYutaGbVZIgze6wegLO6i8MD2kJ1N1cYKAUXTLnRWxtnYrMONWRRD+EsA3utw4mnKxNCZRgplK5T05ycvaaZCmtAOEKl+p4ge70k06mcdrQoPgGpbY1EboNyY7/ZHVsfK1BLhBAdCA5MGd719b0gUOJmg9vc5hf3E+K2y1EQDnCjxoGs3t84WiA6zI253rVy6MRnSKNxJtQcRY3xL90MkN6DYGZHI3zBMaF1NcoUQ3Oll+9RBqHb1uIzSTmv9LtQOJbC7Ci/fRsivh0+sBrYwix3GKe8No5yHJTDaZqhqOp8KC6BdmXrFKFaXUUWk7uCLsRPbuAZrmsPjCANBKChIZj/97IBzSJq3pgpymiYRmnxMLG9YbinUGCk5rxbUhJDy/yH+C5U3wP1FQWDL5AtWpNQm0IRz/ys+psCTSKuCObTjY3KhLoCrbUY7ZgIqHRXrTSFHxwfFjcM1fWF8devtJPK2XtM6nAOpcrCXDlVR967qRi6XOY78NJsi95gcsJynMXF2k6gAFFhVFGLz0loz5u0HGoEGF6qOoVgC6cOB6iBb0Ixue66p+p8F+v17VkhUTqGXP6pVptC8JU07z0Ga5VqjmUpvBvuC8wpej4bJiXK+ZHnazfXyfUSipxPVJQvMTjppUKlFUVvv8PIVftrSIRD+Q6DQ7a47wzE9xjaYJk1Fty1v8CYauOLm+fv3Cikjv4lBqVCAP6n/gfZhdXQlm1mfwAAAABJRU5ErkJggg==';
})();
