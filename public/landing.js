// Centrehold landing: the confluence (letters ride the streams; the river
// flow field calms as you descend). Progressive: no JS, no motion, same page.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Headline: letters ride the streams. Each letter enters at a screen
  // edge (left half of the sentence from the left bank, gold; right half from
  // the right bank, teal), meanders along its own generated stream path to a
  // collision knot at the centre of the headline, beats, bursts outward into
  // its seat, and assimilates -- losing its current's color as it joins the
  // sentence. Words wrap as units so lines never break mid-word.
  var headline = document.getElementById('headline');
  var pathsOk = window.CSS && CSS.supports && CSS.supports('offset-distance', '0%');
  if (!reduced && headline && pathsOk) {
    headline.querySelectorAll('.ln').forEach(function (line) {
      var total = line.textContent.length;
      var idx = 0;
      var frag = document.createDocumentFragment();

      function addWord(target, wordText) {
        var w = document.createElement('span');
        w.className = 'word';
        for (var i = 0; i < wordText.length; i++) {
          var ch = document.createElement('span');
          ch.className = 'ch';
          ch.textContent = wordText[i];
          // Source bank is RANDOM, decoupled from the seat: gold letters end
          // up all across the sentence and must cross the other stream to
          // get home -- the mixing of ideas, visible.
          var side = Math.random() < 0.5 ? -1 : 1;
          ch.dataset.side = side < 0 ? 'L' : 'R';
          ch.style.setProperty('--dl', (Math.random() * 1.8).toFixed(2) + 's');
          ch.style.setProperty('--tint', side < 0 ? 'var(--gold)' : 'var(--teal)');
          // Paint exchanged in the impact: a good share of letters leave the
          // collision wearing the OTHER current's color.
          if (Math.random() < 0.45) {
            ch.style.setProperty('--mid', side < 0 ? 'var(--teal)' : 'var(--gold)');
          }
          w.appendChild(ch);
          idx++;
        }
        target.appendChild(w);
      }

      Array.prototype.forEach.call(line.childNodes, function (node) {
        var isEm = node.nodeName === 'EM';
        var text = node.textContent;
        var target = frag;
        if (isEm) {
          var em = document.createElement('em');
          frag.appendChild(em);
          target = em;
        }
        var parts = text.split(' ');
        for (var wi = 0; wi < parts.length; wi++) {
          if (parts[wi].length) { addWord(target, parts[wi]); }
          if (wi < parts.length - 1) {
            target.appendChild(document.createTextNode(' '));
            idx++;
          }
        }
      });
      line.textContent = '';
      line.appendChild(frag);
    });

    // Paths need the letters' final (seated) positions, so measure after the
    // webfonts have settled the layout, then hand each letter its stream.
    // Cubic Bezier arc length by chord sampling (plenty for a timing cue).
    function clen(p0, p1, p2, p3) {
      var L = 0, px = p0[0], py = p0[1], N = 24;
      for (var i = 1; i <= N; i++) {
        var t = i / N, u = 1 - t;
        var x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
        var y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
        L += Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
        px = x; py = y;
      }
      return L;
    }
    var buildPaths = function () {
      var vw = window.innerWidth || 1200;
      var vh = window.innerHeight || 800;
      var hrect = headline.getBoundingClientRect();
      var ccx = hrect.left + hrect.width / 2;
      var ccy = hrect.top + hrect.height / 2;
      headline.querySelectorAll('.ch').forEach(function (ch) {
        var r = ch.getBoundingClientRect();
        var sx = r.left + r.width / 2;
        var sy = r.top + r.height / 2;
        // The path rides the letter's CENTER, but its coordinate origin is the
        // letter box's top-left -- shift every point by the half-box so the
        // seated letter lands exactly on its layout position.
        var hw = r.width / 2, hh = r.height / 2;
        function pt(x, y) { return (x + hw).toFixed(0) + ' ' + (y + hh).toFixed(0); }
        var side = ch.dataset.side === 'L' ? -1 : 1;
        // Start at the bank, anywhere in the upper ~85% of the viewport.
        var dxs = (side < 0 ? -50 : vw + 50) - sx;
        var dys = Math.random() * vh * 0.85 - sy;
        // Collision front: not a point -- a tall vertical band at the centre,
        // like the seam where two rivers actually meet.
        var dxc = ccx - sx + (Math.random() - 0.5) * 160;
        var dyc = ccy - sy + (Math.random() - 0.5) * 300;
        // Recoil: fully random direction. Two opposing streams cancel their
        // momentum head-on; the splash goes EVERYWHERE, so the colors mix in
        // the explosion instead of re-sorting back to their banks.
        var ang = Math.random() * Math.PI * 2;
        // Recoil scaled to how far the seat is from the knot: a letter seated
        // near the centre gets a short throw, an edge letter a long one, so
        // every recoil arc is a similar SHARE of its own way home and no
        // letter is flung out of proportion to the distance it must cover.
        var seatDist = Math.sqrt(dxc * dxc + dyc * dyc);
        var mag = Math.max(120, Math.min(400, 110 + seatDist * 0.45 + Math.random() * 130));
        var rx = dxc + Math.cos(ang) * mag;
        var ry = dyc + Math.sin(ang) * mag * 0.85;
        // Meander waviness (inbound), and a separate curl for the way home.
        var w1 = (Math.random() - 0.5) * 280;
        var w2 = (Math.random() - 0.5) * 240;
        var v1 = (Math.random() - 0.5) * 240;
        var v2 = (Math.random() - 0.5) * 220;
        // Control point INTO the apex, and its mirror OUT of it -- C1
        // continuity at the apex, so the letter sweeps through the far point
        // in one unbroken arc instead of stopping and reversing.
        var cinx = rx + (Math.random() - 0.5) * 90;
        var ciny = ry + (Math.random() - 0.5) * 90;
        var coutx = 2 * rx - cinx;
        var couty = 2 * ry - ciny;
        var p0 = [dxs, dys];
        var a1 = [dxs * 0.55 + w1, dys * 0.55 + w2], a2 = [dxc + w1 * 0.4, dyc - w2 * 0.4], k = [dxc, dyc];
        var b1 = [dxc + Math.cos(ang) * mag * 0.35, dyc + Math.sin(ang) * mag * 0.55 - 30], b2 = [cinx, ciny], ap = [rx, ry];
        var c1 = [coutx, couty], c2 = [v1 * 0.5 - rx * 0.1, v2 * 0.5 - ry * 0.1], seat = [0, 0];
        var path = 'M ' + pt(p0[0], p0[1]) +
          ' C ' + pt(a1[0], a1[1]) + ', ' + pt(a2[0], a2[1]) + ', ' + pt(k[0], k[1]) +
          ' C ' + pt(b1[0], b1[1]) + ', ' + pt(b2[0], b2[1]) + ', ' + pt(ap[0], ap[1]) +
          ' C ' + pt(c1[0], c1[1]) + ', ' + pt(c2[0], c2[1]) + ', ' + pt(seat[0], seat[1]);
        ch.style.offsetPath = 'path("' + path + '")';
        // The impact beat is keyed to WHERE the knot actually sits on this
        // letter's path, not to a fixed share of it -- every letter hits the
        // seam on the same beat, whatever the shape of its stream.
        var lIn = clen(p0, a1, a2, k), lOut = clen(k, b1, b2, ap) + clen(ap, c1, c2, seat);
        var knot = lIn / Math.max(1, lIn + lOut) * 100;
        ch.style.setProperty('--knot', Math.max(40, Math.min(92, knot)).toFixed(1) + '%');
      });
      headline.classList.add('looping');
    };
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(buildPaths); }
    else { setTimeout(buildPaths, 350); }
  }

  // --- Reveals + gate ripples ---
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // --- The river: a flow field that calms as you descend ---
  var canvas = document.getElementById('river');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var particles = [];
  var COUNT = 300;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0E141A';
    ctx.fillRect(0, 0, W, H);
  }

  function spawn(p) {
    var side = p && p.side !== undefined ? p.side : (Math.random() < 0.5 ? 0 : 1);
    var x = side === 0 ? -20 - Math.random() * 30 : W + 20 + Math.random() * 30;
    return { x: x, y: Math.random() * H, px: x, py: 0, side: side };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      var side = Math.random() < 0.5 ? 0 : 1;
      var x = side === 0 ? Math.random() * W * 0.5 : W - Math.random() * W * 0.5;
      particles.push({ x: x, y: Math.random() * H, px: x, py: 0, side: side });
    }
  }

  var t = 0;
  window.addEventListener('resize', function () { init(); });

  // The confluence, in three acts per particle:
  //   1. Approach: turbulent lateral flow from the banks toward the centre.
  //   2. Collision: inside the impact zone the opposing currents actually
  //      hit -- strong chaotic splash, particles thrown up, down and across.
  //   3. Merge: the splash decays with fall distance; a few hundred pixels
  //      downstream the mixed flow has sorted itself into a laminar column.
  // Order is emergent DOWNSTREAM of the impact, not imposed at the midline.
  function step(p, noisy) {
    p.px = p.x; p.py = p.y;

    var cx = W / 2;
    var d = cx - p.x;
    var ad = Math.abs(d);
    var dir = d > 0 ? 1 : -1;
    var impactHalf = Math.max(36, W * 0.045);
    var vx, vy, phase;

    if (!p.merged) {
      // Act 1: approach. Turbulent streams, accelerating toward the impact.
      var distFrac = Math.min(1, ad / (W * 0.5));
      vx = dir * (0.7 + 1.3 * (1 - distFrac));
      vy = 0;
      if (noisy) {
        var n1 = Math.sin(p.y * 0.006 + t * 0.9 + p.x * 0.0021) + Math.cos(p.x * 0.0047 - t * 0.63);
        var a1 = n1 * Math.PI;
        var T1 = 0.35 + 0.65 * distFrac;
        vx += Math.cos(a1) * T1 * 1.6;
        vy += Math.sin(a1) * T1 * 1.5;
      }
      if (ad < impactHalf) { p.merged = true; p.mergeY = p.y; }
      phase = 0;
    } else {
      // Acts 2-3: collision splash, decaying into laminar fall.
      var fall = Math.max(0, Math.min(1, (p.y - p.mergeY) / 340));
      var splash = (1 - fall) * (noisy ? 2.8 : 0);
      var n2 = Math.sin(p.y * 0.013 + t * 1.7 + p.x * 0.009) + Math.cos(p.x * 0.011 - t * 1.2);
      var a2 = n2 * Math.PI;
      vx = Math.cos(a2) * splash + d * (0.004 + 0.05 * fall);
      vy = 0.45 + 1.05 * fall + Math.sin(a2) * splash * 0.9;
      phase = fall;
    }

    p.x += vx; p.y += vy;
    return phase;
  }

  function frame() {
    t += 0.008;
    ctx.fillStyle = 'rgba(14, 20, 26, 0.08)';
    ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1.1;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var phase = step(p, true);

      if (p.y > H + 16 || p.y < -60 || p.x < -60 || p.x > W + 60) {
        particles[i] = spawn(p);
        continue;
      }

      var alpha = p.merged ? (0.5 - 0.16 * phase) : 0.18;
      ctx.strokeStyle = p.side === 0
        ? 'rgba(217, 164, 65, ' + alpha.toFixed(3) + ')'
        : 'rgba(63, 133, 120, ' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    requestAnimationFrame(frame);
  }

  init();
  if (reduced) {
    // Motion-reduced: render one static confluence pass, then hold still.
    for (var k = 0; k < 460; k++) {
      t += 0.008;
      ctx.fillStyle = 'rgba(14, 20, 26, 0.02)';
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1.1;
      for (var j = 0; j < particles.length; j++) {
        var q = particles[j];
        step(q, false);
        if (q.y > H + 16 || q.x < -60 || q.x > W + 60) { particles[j] = spawn(q); continue; }
        var qa = q.merged ? 0.24 : 0.12;
        ctx.strokeStyle = q.side === 0
          ? 'rgba(217,164,65,' + qa + ')'
          : 'rgba(63,133,120,' + qa + ')';
        ctx.beginPath(); ctx.moveTo(q.px, q.py); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  } else {
    requestAnimationFrame(frame);
  }
})();
