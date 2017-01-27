
// init of new canvas
V.resize_ = function(width, height, mc_) {//{{{
	mww_ = 200,
    mhh_ = 200,
    mww_p50 = mww + 50,
    mhh_p50 = mhh + 50,
    mww_p150 = mww + 150,
    mhh_p150 = mhh + 150,
    mww_2 = mww_ / 2,
    mhh_2 = mhh_ / 2;

    ww_ = Math.ceil(width);
    hh_ = Math.ceil(height);
	ww_ -= wsu;

	var e = Math.sqrt(ww_ * ww_ + hh_ * hh_),
		b = Math.ceil(1400 * ww_ / e),
		c = Math.ceil(1400 * hh_ / e);
	1100 < b && (c = Math.ceil(1100 * c / b), b = 1100);
	1100 < c && (b = Math.ceil(1100 * b / c), c = 1100);
	var lgbsc = 560 > hh_ ? Math.max(50, hh_) / 560 : 1;
	e = Math.round(lgbsc * lgcsc * 1E5) / 1E5;
	if (mww_ != b || mhh_ != c) mww_ = b, mhh_ = c, mc_.width = mww_, mc_.height = mhh_, mww_p50 = mww_ + 50, mhh_p50 = mhh_ + 50, mww_p150 = mww_ + 150, mhh_p150 = mhh_ + 150, mww_2 = mww_ / 2, mhh_2 =
		mhh_ / 2, rdgbg();
	var csc = Math.min(ww_ / mww_, hh_ / mhh_);
	trf(mc_, "scale(" + csc + "," + csc + ")");
	mc_.style.left = Math.floor(ww_ / 2 - mww_ / 2) + "px";
	mc_.style.top = Math.floor(hh_ / 2 - mhh_ / 2) + "px"
}//}}}

V.redraw_ = function(mc_player, mc_points, mc_snakes) {//{{{
			// >>>>>>>>>>>>>
			// change canvas
			// <<<<<<<<<<<<<
var canvases = [mc_player.getContext("2d"), mc_points.getContext("2d"), mc_snakes.getContext("2d")];
for ( var canvases_i in canvases) {
	var b = canvases[canvases_i];

        if (animating) {
            if (snake) {
                var e = .5 + .4 / Math.max(1, (snake.sct + 16) / 36);
                gsc != e && (gsc < e ? (gsc += 2E-4, gsc >= e && (gsc = e)) : (gsc -= 2E-4, gsc <= e && (gsc = e)))
            }
            var e = view_xx,
                c = view_yy;
            null != snake && (0 < fvtg && (fvtg--, fvx = fvxs[fvpos], fvy = fvys[fvpos], fvxs[fvpos] = 0, fvys[fvpos] = 0, fvpos++, fvpos >= vfc && (fvpos = 0)), view_xx = snake.xx + snake.fx + fvx, view_yy = snake.yy + snake.fy + fvy, choosing_skin && (view_xx -= 104, gsc = 1), view_ang = Math.atan2(view_yy - grd, view_xx - grd),
                view_dist = Math.sqrt((view_xx - grd) * (view_xx - grd) + (view_yy - grd) * (view_yy - grd)), bpx1 = view_xx - (mww_2 / gsc + 84), bpy1 = view_yy - (mhh_2 / gsc + 84), bpx2 = view_xx + (mww_2 / gsc + 84), bpy2 = view_yy + (mhh_2 / gsc + 84), fpx1 = view_xx - (mww_2 / gsc + 24), fpy1 = view_yy - (mhh_2 / gsc + 24), fpx2 = view_xx + (mww_2 / gsc + 24), fpy2 = view_yy + (mhh_2 / gsc + 24), apx1 = view_xx - (mww_2 / gsc + 210), apy1 = view_yy - (mhh_2 / gsc + 210), apx2 = view_xx + (mww_2 / gsc + 210), apy2 = view_yy + (mhh_2 / gsc + 210));

			// >>>>>>>>>>>>>>>>
			// background start//{{{
			if(game_background) {
				bgx2 -= 1 * (view_xx - e) / bgw2;
				bgy2 -= 1 * (view_yy - c) / bgh2;
				bgx2 %= 1;
				0 > bgx2 && (bgx2 += 1);
				bgy2 %= 1;
				0 > bgy2 && (bgy2 += 1);
				if (bgp2) {
					b.save();
					b.fillStyle = bgp2;
					if(game_background_move) {
						b.translate(mww_2, mhh_2);
						b.scale(gsc, gsc);
						b.translate(bgx2 * bgw2, bgy2 * bgh2);
						b.globalAlpha = .4 + .6 * (1 - gla);
					}
					b.fillRect(3 * -mww_ / gsc, 3 * -mhh_ / gsc, 5 * mww_ / gsc, 5 * mhh_ / gsc);
					b.restore()
				}
			} else {
				b.save();
				b.fillStyle = game_background_color;
				b.fillRect(3 * -mww_ / gsc, 3 * -mhh_ / gsc, 5 * mww_ / gsc, 5 * mhh_ / gsc);
				b.restore();
			}
			// background end//}}}
			// <<<<<<<<<<<<<<

			if(canvases_i==1) {
            if (testing)
                for (e = sectors.length - 1; 0 <= e; e--) c = sectors[e], b.fillStyle = "rgba(0, 255, 0, .1)", b.fillRect(mww_2 + (c.xx * sector_size - view_xx) * gsc, mhh_2 + (c.yy * sector_size - view_yy) * gsc, sector_size * gsc - 4, sector_size * gsc - 4);
            b.save();
            b.globalCompositeOperation = "lighter";
			for (e = foods_c - 1; 0 <= e; e--) c = foods[e], c.rx >= fpx1 && c.ry >= fpy1 && c.rx <= fpx2 && c.ry <= fpy2 && (1 == c.rad ? (A = mww_2 + gsc * (c.rx - view_xx) - c.fw2, D = mhh_2 + gsc * (c.ry - view_yy) - c.fh2,
                    b.globalAlpha = c.fr, b.drawImage(c.fi, A, D)) : (A = mww_2 + gsc * (c.rx - view_xx) - c.fw2 * c.rad, D = mhh_2 + gsc * (c.ry - view_yy) - c.fh2 * c.rad, b.globalAlpha = c.fr, b.drawImage(c.fi, 0, 0, c.fw, c.fh, A, D, c.fw * c.rad, c.fh * c.rad)));
            b.restore();
            b.save();
            b.globalCompositeOperation = "lighter";
            for (e = preys.length - 1; 0 <= e; e--)
                if (f = preys[e], h = f.xx + f.fx, u = f.yy + f.fy, px = mww_2 + gsc * (h - view_xx), py = mhh_2 + gsc * (u - view_yy), -50 <= px && -50 <= py && px <= mww_p50 && py <= mhh_p50) {
                    if (f.eaten) {
                        var c = f.eaten_by,
                            q = Math.pow(f.eaten_fr, 2),
                            h = h + (c.xx + c.fx + Math.cos(c.ang + c.fa) *
                                (43 - 24 * q) * (1 - q) - h) * q,
                            u = u + (c.yy + c.fy + Math.sin(c.ang + c.fa) * (43 - 24 * q) * (1 - q) - u) * q;
                        px = mww_2 + gsc * (h - view_xx);
                        py = mhh_2 + gsc * (u - view_yy)
                    }
                    1 == f.rad ? (A = px - f.fw2, D = py - f.fh2, b.globalAlpha = .75 * f.fr, b.drawImage(f.fi, A, D), b.globalAlpha = .75 * (.5 + .5 * Math.cos(f.gfr / 13)) * f.fr, b.drawImage(f.fi, A, D)) : (A = px - f.fw2 * f.rad, D = py - f.fh2 * f.rad, b.globalAlpha = .75 * f.fr, b.drawImage(f.fi, 0, 0, f.fw, f.fh, A, D, f.fw * f.rad, f.fh * f.rad), b.globalAlpha = .75 * (.5 + .5 * Math.cos(f.gfr / 13)) * f.fr, b.drawImage(f.fi, 0, 0, f.fw, f.fh, A, D, f.fw * f.rad, f.fh * f.rad))
                }
            b.restore();
			}
            b.save();
            b.strokeStyle = "#90C098";

			// >>>>>>>>> 
			// worm name //{{{
			// >>>>>>>>> 
            for (var h, u, C, e = snakes.length - 1; 0 <= e; e--) {
				c = snakes[e], h = c.xx + c.fx, u = c.yy + c.fy + 40, 0 < c.na && h >= bpx1 - 100 && u >= bpy1 && h <= bpx2 + 100 && u <= bpy2 && (c == snake && (c.fnfr++, 200 < c.fnfr && (c.na -= .004, 0 > c.na && (c.na = 0))), b.save(), b.globalAlpha = .5 * c.na * c.alive_amt * (1 - c.dead_amt), b.font = "12px Arial, Helvetica Neue, Helvetica, sans-serif", b.fillStyle = c.csw, b.textBaseline = "middle", b.textAlign = "center", f = c.xx + c.fx, w = c.yy + c.fy, f = mww_2 + (f - view_xx) * gsc, w = mhh_2 + (w - view_yy) * gsc, (worm_name && b.fillText(c.nk, f, w + 32 + 11 * c.sc * gsc)) , b.restore());
			}
			// <<<<<<<<< 
			// worm name //}}}
			// <<<<<<<<< 

            for (e = snakes.length - 1; 0 <= e; e--)
                for (c = snakes[e], c.iiv = !1, t = c.pts.length - 1; 0 <= t; t--)
                    if (z = c.pts[t], px = z.xx + z.fx, py = z.yy + z.fy, px >= bpx1 && py >= bpy1 && px <= bpx2 && py <= bpy2) {
                        c.iiv = !0;
                        break
                    }

            for (e = snakes.length - 1; 0 <= e; e--)
                if (c = snakes[e], c.iiv) {

					// >>>>>>>>>>>>>>>>>>>>
					// draw canvas specific
					if(c != snake && canvases_i==0)
						continue;
					if(canvases_i==1)
						continue
					if(c == snake && canvases_i==2)
						continue;
					// <<<<<<<<<<<<<<<<<<<<

                    f = c.xx + c.fx;
                    w = c.yy + c.fy;
                    px = f;
                    py = w;
                    C = c.ehang;
                    var x = c.sc,
                        B = 29 * x,
                        G = c.cfl,
                        z = c.pts[c.pts.length - 1];

					// >>>>>>>>>>
					// easy color
					// if(e==0)
					// c.cv = 0;
					// else
					var c_cv = 0;
					var c_rbcs = false;
					// <<<<<<<<<<


					// >>>>>>>>>>>
					// worm segments //{{{
                    if (!worm_detail) {
                        b.save();
                        b.beginPath();
                        b.moveTo(mww_2 + (px - view_xx) * gsc, mhh_2 + (py - view_yy) * gsc);
                        h = !1;
                        for (var t = c.pts.length - 1; 0 <= t; t--) {
                            z = c.pts[t];
                            lpx =
                                px;
                            lpy = py;
                            px = z.xx;
                            py = z.yy;
                            var A = z.fx,
                                D = z.fy;
                            0 < G && (px += A, py += D, lax = ax, lay = ay, ax = (px + lpx) / 2, ay = (py + lpy) / 2, h || (lax = ax, lay = ay), 1 > G && (q = 1 - G, lpx += (lax - lpx) * q, lpy += (lay - lpy) * q, ax += (lax - ax) * q, ay += (lay - ay) * q), h ? G-- : G -= c.chl + c.fchl, h ? b.quadraticCurveTo(mww_2 + (lpx - view_xx) * gsc, mhh_2 + (lpy - view_yy) * gsc, mww_2 + (ax - view_xx) * gsc, mhh_2 + (ay - view_yy) * gsc) : (b.lineTo(mww_2 + (ax - view_xx) * gsc, mhh_2 + (ay - view_yy) * gsc), h = !0))
                        }
                        b.save();

						// >>>>>>>>>>>>>>>
						// worm round head
						if(worm_round_head) {
							b.lineJoin = "round";
							b.lineCap = "round";
						}
						// <<<<<<<<<<<<<<<
						
                        // doiosh ?  (c.sp > c.fsp && (t = c.alive_amt * (1 - c.dead_amt) * Math.max(0, Math.min(1, (c.sp - c.ssp) / (c.msp - c.ssp))), b.save(), b.strokeStyle = c.cs, b.globalAlpha = .3 * t, b.lineWidth = (B + 6) * gsc, b.stroke(), b.lineWidth = (B + 9) * gsc, b.stroke(), b.lineWidth = (B + 12) * gsc, b.stroke(), b.restore()), b.globalAlpha = 1 * c.alive_amt * (1 - c.dead_amt), b.strokeStyle = "#000000", b.lineWidth = (B + 5) * gsc)// : 
						if(c.sp > c.fsp) {
							t = c.alive_amt * (1 - c.dead_amt) * Math.max(0, Math.min(1, (c.sp - c.ssp) / (c.msp - c.ssp)));
							b.save();

							b.lineWidth = (B - 2) * gsc;

							// >>>>>>>>>>>>>>>>>>>>>>>>>
							// worm speed stroke blurred
							if(worm_speed_stroke_blurred)
								b.shadowBlur = 30 * gsc;
							// <<<<<<<<<<<<<<<<<<<<<<<<<
							
							// >>>>>>>>>>>>>>>>>>>>>>>>>
							// worm speed stroke width 
							b.lineWidth = (B + worm_speed_stroke_width) * gsc;
							// >>>>>>>>>>>>>>>>>>>>>>>>>

							// >>>>>>>>>>>>>>>>>>>>>>
							// worm speed stroke fade
							if(worm_speed_stroke_fade)
								b.shadowColor = "rgba(" + c.rr + "," + c.gg + "," + c.bb + ", " + Math.round(1E4 * t) / 1E4 + ")";
							else
								b.shadowColor = "rgba(" + c.rr + "," + c.gg + "," + c.bb + ", 1 )";
							// <<<<<<<<<<<<<<<<<<<<<<
							b.stroke();
							b.stroke();
							b.restore();
							b.globalAlpha = .4 * c.alive_amt * (1 - c.dead_amt);
							b.strokeStyle = "#000000";
							b.lineWidth = (B + 5) * gsc;
							b.stroke();
							b.strokeStyle = c.cs;
							b.lineWidth = B * gsc;
							b.strokeStyle = "#000000";
							b.globalAlpha = 1 * c.alive_amt * (1 - c.dead_amt);
							b.stroke();
						};

						// draw worm
                        b.strokeStyle = c.cs;
                        b.globalAlpha = .8 * c.alive_amt * (1 - c.dead_amt);
                        b.lineWidth = B * gsc;
                        b.stroke();

                        b.restore();

						// >>>>>>>>>>>>>>
						// blink on death
						if(worm_blink_on_death) {
							b.strokeStyle = c.cs;
							c.dead && (D = (.5 + .5 * Math.abs(Math.sin(5 * Math.PI * c.dead_amt))) * Math.sin(Math.PI * c.dead_amt), b.save(), b.lineJoin = "round", b.lineCap =
								"round", b.globalCompositeOperation = "lighter", b.lineWidth = (B - 3) * gsc, b.globalAlpha = D, b.strokeStyle = "#FFCC99", b.stroke(), b.restore());
							b.restore()
						}
						// <<<<<<<<<<<<<<

                    } else {
                        var B = .5 * B,
                            I, M, y, F, H, K, N, E;
                        px = f;
                        py = w;
                        H = px;
                        K = py;
                        H >= bpx1 && K >= bpy1 && H <= bpx2 && K <= bpy2 ? (pbx[0] = H, pby[0] = K, pba[0] = Math.atan2(w - (z.yy + z.fy), f - (z.xx + z.fx)) + Math.PI, pbu[0] = 1) : pbu[0] = 0;
                        A = 1;
                        n = (c.chl + c.fchl) % .25;
                        0 > n && (n += .25);
                        n = .25 - n;
                        G += 1 - .25 * Math.ceil((c.chl + c.fchl) / .25);
                        ax = px;
                        ay = py;
                        c.sep != c.wsep && (c.sep < c.wsep ? (c.sep += .01, c.sep >= c.wsep && (c.sep = c.wsep)) :
                            c.sep > c.wsep && (c.sep -= .01, c.sep <= c.wsep && (c.sep = c.wsep)));
                        for (var O = c.sep * qsm, L = 0, D = per_color_imgs_[c_cv].kmcs, J, t = c.pts.length - 1; 0 <= t; t--)
                            if (z = c.pts[t], lpx = px, lpy = py, px = z.xx + z.fx, py = z.yy + z.fy, -.25 < G) {
                                y = H;
                                F = K;
                                H = (px + lpx) / 2;
                                K = (py + lpy) / 2;
                                N = lpx;
                                E = lpy;
                                for (q = 0; 1 > q; q += .25) {
                                    z = n + q;
                                    h = y + (N - y) * z;
                                    u = F + (E - F) * z;
                                    I = N + (H - N) * z;
                                    M = E + (K - E) * z;
                                    lax = ax;
                                    lay = ay;
                                    ax = h + (I - h) * z;
                                    ay = u + (M - u) * z;
                                    0 > G && (ax += -(lax - ax) * G / .25, ay += -(lay - ay) * G / .25);
                                    I = Math.sqrt(Math.pow(ax - lax, 2) + Math.pow(ay - lay, 2));
                                    if (L + I < O) L += I;
                                    else {
                                        L = -L;
                                        for (z = (I - L) / O; 1 <= z; z--) L +=
                                            O, pax = lax + (ax - lax) * L / I, pay = lay + (ay - lay) * L / I, pax >= bpx1 && pay >= bpy1 && pax <= bpx2 && pay <= bpy2 ? (pbx[A] = pax, pby[A] = pay, pbu[A] = 1, h = ax - lax, u = ay - lay, pba[A] = -15 <= h && -15 <= u && 15 > h && 15 > u ? at2lt[8 * u + 128 << 8 | 8 * h + 128] : -127 <= h && -127 <= u && 127 > h && 127 > u ? at2lt[u + 128 << 8 | h + 128] : Math.atan2(u, h)) : pbu[A] = 0, A++;
                                        L = I - L
                                    }
                                    if (1 > G && (G -= .25, -.25 >= G)) break
                                }
                                1 <= G && G--
                            }
                        ax >= bpx1 && ay >= bpy1 && ax <= bpx2 && ay <= bpy2 ? (pbu[A] = 1, pbx[A] = ax, pby[A] = ay, pba[A] = Math.atan2(ay - lay, ax - lax)) : pbu[A] = 0;
                        A++;
                        b.save();
                        b.translate(mww_2, mhh_2);
                        q = gsc * B * 52 / 32;
                        H = gsc * B * 62 / 32;
                        G = c.alive_amt * (1 - c.dead_amt);
                        G *= G;
                        z = 1;
                        if (c.tsp > c.fsp) {
                            z = c.alive_amt * (1 - c.dead_amt) * Math.max(0, Math.min(1, (c.tsp - c.ssp) / (c.msp - c.ssp)));
                            J = .37 * z;
                            L = Math.pow(z, .5);
                            y = gsc * B * (1 + .9375 * L);
                            u = per_color_imgs_[c_cv].kfmc;
                            b.save();
                            b.globalCompositeOperation = "lighter";
                            if (c_rbcs)
                                for (K = c_rbcs, O = K.length, t = A - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], u = per_color_imgs_[K[t % O]], u = u.kfmc, b.save(), b.globalAlpha = G * L * .38 * (.6 + .4 * Math.cos(t / 4 - 1.15 * c.sfr)), b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), 4 > t ? (h = y * (1 + (4 - t) * c.swell),
                                    b.drawImage(u, -h, -h, 2 * h, 2 * h)) : b.drawImage(u, -y, -y, 2 * y, 2 * y), b.restore());
                            else
                                for (t = A - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], b.save(), b.globalAlpha = G * L * .38 * (.6 + .4 * Math.cos(t / 4 - 1.15 * c.sfr)), b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), 4 > t ? (h = y * (1 + (4 - t) * c.swell), b.drawImage(u, -h, -h, 2 * h, 2 * h)) : b.drawImage(u, -y, -y, 2 * y, 2 * y), b.restore());
                            b.restore();
                            z = 1 - z
                        }
                        z *= G;
                        b.globalAlpha = z;
                        if (c_rbcs) {
                            K = c_rbcs;
                            O = K.length;
                            for (t = A - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], 2 <= t && (q = t - 2, 1 == pbu[q] && (h = pbx[q], u = pby[q], b.save(), b.translate((h - view_xx) * gsc, (u - view_yy) * gsc), 9 > q ? (b.globalAlpha = q / 9 * z, 4 > q ? (h = H * (1 + (4 - q) * c.swell), b.drawImage(ksmc, -h, -h, 2 * h, 2 * h)) : b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)) : (b.globalAlpha = z, b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)), b.restore())), b.save(), b.globalAlpha = G, b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), b.rotate(pba[t]), q = t % (2 * D.length), q >= D.length && (q = 2 * D.length - (q + 1)), u = per_color_imgs_[K[t % O]], 4 > t ? (h = B * (1 + (4 - t) * c.swell), b.drawImage(u.kmcs[q], -gsc * h, -gsc * h, 2 * gsc * h, 2 * gsc * h)) : b.drawImage(u.kmcs[q], -gsc * B, -gsc * B, 2 * gsc * B, 2 * gsc * B), b.restore());
						} else {
                            for (t = A - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], 2 <= t && (q = t - 2, 1 == pbu[q] && (h = pbx[q], u = pby[q], b.save(),
                                b.translate((h - view_xx) * gsc, (u - view_yy) * gsc), 9 > q ? (b.globalAlpha = q / 9 * z, 4 > q ? (h = H * (1 + (4 - q) * c.swell), b.drawImage(ksmc, -h, -h, 2 * h, 2 * h)) : b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)) : (b.globalAlpha = z, b.drawImage(ksmc, -H, -H, 2 * H, 2 * H)), b.restore())), b.save(), b.globalAlpha = G, b.translate((px - view_xx) * gsc, (py - view_yy) * gsc), b.rotate(pba[t]), q = t % (2 * D.length), q >= D.length && (q = 2 * D.length - (q + 1)), 4 > t ? (h = B * (1 + (4 - t) * c.swell), b.drawImage(D[q], -gsc * h, -gsc * h, 2 * gsc * h, 2 * gsc * h)) : b.drawImage(D[q], -gsc * B, -gsc * B, 2 * gsc * B, 2 * gsc * B), b.restore());
                        }
                        b.restore()
                    }
					// worm segments //}}}
					// <<<<<<<<<<<

					// >>>>>>>>>>>>
					// worm antenna //{{{
					if (worm_antenna)
						if (c.antenna)
						if (h = Math.cos(c.ang), u = Math.sin(c.ang),
							ax = f - 8 * h * c.sc, ay = w - 8 * u * c.sc, 2 <= A && ax >= apx1 && ay >= apy1 && ax <= apx2 && ay <= apy2) {
								c.atx[0] = ax;
								c.aty[0] = ay;
								z = c.sc * gsc;
								fj = c.atx.length - 1;
								if (choosing_skin)
									for (t = 1; t <= fj; t++) c.atvx[t] -= .3, c.atvy[t] += .14 * Math.cos(fr / 23 - 7 * t / fj);
								else if (!c.antenna_shown)
									for (c.antenna_shown = !0, t = 1; t <= fj; t++) c.atx[t] = ax - h * t * 4 * c.sc, c.aty[t] = ay - u * t * 4 * c.sc;
								for (t = 1; t <= fj; t++) xx = c.atx[t - 1], yy = c.aty[t - 1], xx += 2 * Math.random() - 1, yy += 2 * Math.random() - 1, h = c.atx[t] - xx, u = c.aty[t] - yy, ang = -4 <= h && -4 <= u && 4 > h && 4 > u ? at2lt[32 * u + 128 << 8 | 32 * h + 128] : -8 <= h &&
									-8 <= u && 8 > h && 8 > u ? at2lt[16 * u + 128 << 8 | 16 * h + 128] : -16 <= h && -16 <= u && 16 > h && 16 > u ? at2lt[8 * u + 128 << 8 | 8 * h + 128] : -127 <= h && -127 <= u && 127 > h && 127 > u ? at2lt[u + 128 << 8 | h + 128] : Math.atan2(u, h), xx += 4 * Math.cos(ang) * c.sc, yy += 4 * Math.sin(ang) * c.sc, c.atvx[t] += .1 * (xx - c.atx[t]), c.atvy[t] += .1 * (yy - c.aty[t]), c.atx[t] += c.atvx[t], c.aty[t] += c.atvy[t], c.atvx[t] *= .88, c.atvy[t] *= .88, h = c.atx[t] - c.atx[t - 1], u = c.aty[t] - c.aty[t - 1], I = Math.sqrt(h * h + u * u), I > 4 * c.sc && (ang = -4 <= h && -4 <= u && 4 > h && 4 > u ? at2lt[32 * u + 128 << 8 | 32 * h + 128] : -8 <= h && -8 <= u && 8 > h && 8 > u ? at2lt[16 *
										u + 128 << 8 | 16 * h + 128] : -16 <= h && -16 <= u && 16 > h && 16 > u ? at2lt[8 * u + 128 << 8 | 8 * h + 128] : -127 <= h && -127 <= u && 127 > h && 127 > u ? at2lt[u + 128 << 8 | h + 128] : Math.atan2(u, h), c.atx[t] = c.atx[t - 1] + 4 * Math.cos(ang) * c.sc, c.aty[t] = c.aty[t - 1] + 4 * Math.sin(ang) * c.sc);
								b.globalAlpha = G;
								b.strokeStyle = c.atc1;
								b.lineWidth = 5 * z;
								b.lineCap = "round";
								b.lineJoin = "round";
								b.beginPath();
								fj = c.atx.length - 1;
								h = (c.atx[fj] - view_xx) * gsc;
								u = (c.aty[fj] - view_yy) * gsc;
								b.moveTo(h, u);
								for (t = fj - 1; 1 <= t; t--) xx = (c.atx[t] - view_xx) * gsc, yy = (c.aty[t] - view_yy) * gsc, 1 <= Math.abs(xx - h) +
									Math.abs(yy - u) && (h = xx, u = yy, b.lineTo(h, u));
								xx = (.5 * (c.atx[1] + c.atx[0]) - view_xx) * gsc;
								yy = (.5 * (c.aty[1] + c.aty[0]) - view_yy) * gsc;
								1 <= Math.abs(xx - h) + Math.abs(yy - u) && (h = xx, u = yy, b.lineTo(h, u));
								b.stroke();
								b.globalAlpha = c.atia * G;
								b.strokeStyle = c.atc2;
								b.lineWidth = 4 * z;
								b.beginPath();
								fj = c.atx.length - 1;
								h = (c.atx[fj] - view_xx) * gsc;
								u = (c.aty[fj] - view_yy) * gsc;
								b.moveTo(h, u);
								for (t = fj - 1; 0 <= t; t--) xx = (c.atx[t] - view_xx) * gsc, yy = (c.aty[t] - view_yy) * gsc, 1 <= Math.abs(xx - h) + Math.abs(yy - u) && (h = xx, u = yy, b.lineTo(h, u));
								b.stroke();
								c.atwg &&
									(b.lineWidth = 3 * z, b.stroke(), b.lineWidth = 2 * z, b.stroke());
								b.globalAlpha = G * c.blba;
								if (c.abrot) {
									b.save();
									b.translate((c.atx[fj] - view_xx) * gsc, (c.aty[fj] - view_yy) * gsc);
									vang = Math.atan2(c.aty[fj] - c.aty[fj - 1], c.atx[fj] - c.atx[fj - 1]) - c.atba;
									if (0 > vang || vang >= pi2) vang %= pi2;
									vang < -Math.PI ? vang += pi2 : vang > Math.PI && (vang -= pi2);
									c.atba = (c.atba + .15 * vang) % pi2;
									b.rotate(c.atba);
									b.drawImage(c.bulb, c.blbx * c.bsc * z, c.blby * c.bsc * z, c.blbw * c.bsc * z, c.blbh * c.bsc * z);
									b.restore()
								} else b.drawImage(c.bulb, (c.atx[fj] - view_xx + c.blbx * c.bsc *
									c.sc) * gsc, (c.aty[fj] - view_yy + c.blby * c.bsc * c.sc) * gsc, c.blbw * c.bsc * z, c.blbh * c.bsc * z);
								c.apbs && (b.globalAlpha = .5 * G, b.lineWidth = 3 * z, b.stroke(), b.lineWidth = 2 * z, b.stroke())
							} else c.antenna_shown && (c.antenna_shown = !1);
					// worm antenna //}}}
					// <<<<<<<<<<<<


					if (c.dead) {
						b.save();
						b.globalCompositeOperation = "lighter";
						D = (.15 + .15 * Math.abs(Math.sin(5 * Math.PI * c.dead_amt))) * Math.sin(Math.PI * c.dead_amt);
						B *= gsc;
						for (t = A - 1; 0 <= t; t--) 1 == pbu[t] && (px = pbx[t], py = pby[t], b.save(), b.globalAlpha = D * (.6 + .4 * Math.cos(t / 4 - 15 * c.dead_amt)), b.translate((px - view_xx) * gsc, (py - view_yy) *
							gsc), 4 > t ? (h = B * (1 + (4 - t) * c.swell), b.drawImage(kdmc, -h, -h, 2 * h, 2 * h)) : b.drawImage(kdmc, -B, -B, 2 * B, 2 * B), b.restore());
						b.restore()
					}


					// >>>>>>>>>
					// worm eyes //{{{
					// >>>>>>>>>
					if(worm_eyes) {
                    c.one_eye ? (t = 3 * x, B = Math.cos(C) * t, A = Math.sin(C) * t, z = x * c.ebisz, b.drawImage(c.ebi, 0, 0, c.ebiw, c.ebih, mww_2 + (B + f - z / 2 - view_xx) * gsc, mhh_2 + (A + w - z / 2 - view_yy) * gsc, z * gsc, z * gsc), B = Math.cos(C) * (t + .15) + c.rex * x, A = Math.sin(C) * (t + .15) + c.rey * x, z = x * c.episz, b.drawImage(c.epi, 0, 0, c.epiw, c.epih, mww_2 + (B + f - z / 2 - view_xx) * gsc, mhh_2 + (A + w - z / 2 - view_yy) * gsc, z * gsc, z * gsc)) : (t = c.ed * x, D = c.esp * x, c.eac ||
                        (B = Math.cos(C) * t + Math.cos(C - Math.PI / 2) * (D + .5), A = Math.sin(C) * t + Math.sin(C - Math.PI / 2) * (D + .5), b.fillStyle = c.ec, 0 < c.eo && (b.lineWidth = c.eo * gsc, b.strokeStyle = "#000000"), b.globalAlpha = c.eca * c.alive_amt, b.beginPath(), b.arc(mww_2 + (B + f - view_xx) * gsc, mhh_2 + (A + w - view_yy) * gsc, c.er * x * gsc, 0, pi2), b.closePath(), 0 < c.eo && b.stroke(), b.fill(), b.globalAlpha = c.ppa, B = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C - Math.PI / 2) * D, A = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C - Math.PI / 2) * D, b.fillStyle = c.ppc, b.beginPath(), b.arc(mww_2 + (B + f - view_xx) *
                            gsc, mhh_2 + (A + w - view_yy) * gsc, c.pr * x * gsc, 0, pi2), b.closePath(), b.fill()), c.eac || (B = Math.cos(C) * t + Math.cos(C + Math.PI / 2) * (D + .5), A = Math.sin(C) * t + Math.sin(C + Math.PI / 2) * (D + .5), b.fillStyle = c.ec, 0 < c.eo && (b.lineWidth = c.eo * gsc, b.strokeStyle = "#000000"), b.globalAlpha = c.eca * c.alive_amt, b.beginPath(), b.arc(mww_2 + (B + f - view_xx) * gsc, mhh_2 + (A + w - view_yy) * gsc, c.er * x * gsc, 0, pi2), b.closePath(), 0 < c.eo && b.stroke(), b.fill(), b.globalAlpha = c.ppa, B = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C + Math.PI / 2) * D, A = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C +
                            Math.PI / 2) * D, b.fillStyle = c.ppc, b.beginPath(), b.arc(mww_2 + (B + f - view_xx) * gsc, mhh_2 + (A + w - view_yy) * gsc, c.pr * x * gsc, 0, pi2), b.closePath(), b.fill()), c.jyt && (z = c.sc * gsc * .25, t = -3 * x, D = 7 * x, B = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C - Math.PI / 2) * D, A = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C - Math.PI / 2) * D, b.save(), b.translate(mww_2 + (B + f - view_xx) * gsc, mhh_2 + (A + w - view_yy) * gsc), b.rotate(C), b.drawImage(ecmc, -24 * z, -24 * z, 48 * z, 48 * z), b.restore(), B = Math.cos(C) * (t + .5) + c.rex * x + Math.cos(C + Math.PI / 2) * D, A = Math.sin(C) * (t + .5) + c.rey * x + Math.sin(C +
                            Math.PI / 2) * D, b.save(), b.translate(mww_2 + (B + f - view_xx) * gsc, mhh_2 + (A + w - view_yy) * gsc), b.rotate(C), b.drawImage(ecmc, -24 * z, -24 * z, 48 * z, 48 * z), b.restore(), t = 5 * x, B = Math.cos(C) * (t + .5) + c.rex * x, A = Math.sin(C) * (t + .5) + c.rey * x, z = c.sc * gsc * .16, b.save(), b.translate(mww_2 + (B + f - view_xx) * gsc, mhh_2 + (A + w - view_yy) * gsc), b.rotate(C), b.drawImage(jmou, -40 * z, -65 * z, 79 * z, 130 * z), b.restore()));
                    b.globalAlpha = 1;
                    c.slg && (z = c.sc * gsc * .25, b.save(), h = 13 * Math.cos(C) * x + Math.cos(C - Math.PI / 2) * (6 * x + .5), u = 13 * Math.sin(C) * x + Math.sin(C - Math.PI / 2) * (6 *
                        x + .5), b.translate(mww_2 + (h + f - view_xx) * gsc, mhh_2 + (u + w - view_yy) * gsc), b.rotate(C - .4), b.drawImage(sest, -28 * z, -44 * z, 105 * z, 88 * z), b.restore(), b.save(), h = 13 * Math.cos(C) * x + Math.cos(C + Math.PI / 2) * (6 * x + .5), u = 13 * Math.sin(C) * x + Math.sin(C + Math.PI / 2) * (6 * x + .5), b.translate(mww_2 + (h + f - view_xx) * gsc, mhh_2 + (u + w - view_yy) * gsc), b.rotate(C + .4), b.drawImage(sest, -28 * z, -44 * z, 105 * z, 88 * z), b.restore())
					}
					// <<<<<<<<<
					// worm eyes //}}}
					// <<<<<<<<<
					
                }
            b.save();
            b.globalCompositeOperation = "lighter";
            for (e = preys.length - 1; 0 <= e; e--) f = preys[e], h = f.xx + f.fx, u = f.yy + f.fy, f.eaten && (c = f.eaten_by, q = Math.pow(f.eaten_fr, 2), h += (c.xx + c.fx + Math.cos(c.ang + c.fa) * (43 - 24 * q) * (1 - q) - h) * q, u += (c.yy + c.fy + Math.sin(c.ang + c.fa) * (43 - 24 * q) * (1 - q) - u) * q), h -= view_xx, u -= view_yy, c = h * h + u * u, fs = 1 + .08 * f.rad, px = h * fs, py = u * fs, J = .4 * (1 - c / (176E3 + c)), 1 != f.rad && (J *= Math.pow(f.rad, .25)), px = px * gsc + mww_2, py =
                py * gsc + mhh_2, 1 == f.rad ? -150 <= px && -150 <= py && px <= mww_p150 && py <= mhh_p150 && (px -= f.gfw2, py -= f.gfh2, b.globalAlpha = J * f.fr, b.drawImage(f.gfi, px, py), b.globalAlpha = J * (.5 + .5 * Math.cos(f.gfr / 13)) * f.fr, b.drawImage(f.gfi, px, py)) : -150 <= px && -150 <= py && px <= mww_p150 && py <= mhh_p150 && (px -= f.gfw2 * f.rad, py -= f.gfh2 * f.rad, b.globalAlpha = J * f.fr, b.drawImage(f.gfi, 0, 0, f.gfw, f.gfh, px, py, f.gfw * f.rad, f.gfh * f.rad), b.globalAlpha = J * (.5 + .5 * Math.cos(f.gfr / 13)) * f.fr, b.drawImage(f.gfi, 0, 0, f.gfw, f.gfh, px, py, f.gfw * f.rad, f.gfh * f.rad)), fs = 1 + .32 * f.rad,
                px = h * fs, py = u * fs, J = .35 * (1 - c / (46500 + c)), 1 != f.rad && (J *= Math.pow(f.rad, .25)), c = 2 * f.rad, px = px * gsc + mww_2, py = py * gsc + mhh_2, -150 <= px && -150 <= py && px <= mww_p150 && py <= mhh_p150 && (px -= f.gfw2 * c, py -= f.gfh2 * c, b.globalAlpha = J * f.fr, b.drawImage(f.gfi, 0, 0, f.gfw, f.gfh, px, py, f.gfw * c, f.gfh * c), b.globalAlpha = J * (.5 + .5 * Math.cos(f.gfr / 13)) * f.fr, b.drawImage(f.gfi, 0, 0, f.gfw, f.gfh, px, py, f.gfw * c, f.gfh * c));
            b.restore();
            if (4E3 > Math.abs(grd - view_dist)) {
                b.save();
                b.lineWidth = 23 * gsc;
                b.strokeStyle = "#800000";
                b.fillStyle = "#300000";
                b.beginPath();
                xx = grd + Math.cos(view_ang - 2E3 / grd) * grd * .98;
                yy = grd + Math.sin(view_ang - 2E3 / grd) * grd * .98;
                b.moveTo(mww_2 + (xx - view_xx) * gsc, mhh_2 + (yy - view_yy) * gsc);
                for (t = -2E3; 2E3 >= t; t += 100) xx = grd + Math.cos(view_ang + t / grd) * grd * .98, yy = grd + Math.sin(view_ang + t / grd) * grd * .98, b.lineTo(mww_2 + (xx - view_xx) * gsc, mhh_2 + (yy - view_yy) * gsc);
                xx = grd + Math.cos(view_ang + 2E3 / grd) * (grd + 4E3);
                yy = grd + Math.sin(view_ang + 2E3 / grd) * (grd + 4E3);
                b.lineTo(mww_2 + (xx - view_xx) * gsc, mhh_2 + (yy - view_yy) * gsc);
                xx = grd + Math.cos(view_ang - 2E3 / grd) * (grd + 4E3);
                yy = grd + Math.sin(view_ang -
                    2E3 / grd) * (grd + 4E3);
                b.lineTo(mww_2 + (xx - view_xx) * gsc, mhh_2 + (yy - view_yy) * gsc);
                b.closePath();
                b.stroke();
                b.fill();
                b.restore()
            }
            wumsts && 0 < rank && 0 < snake_count && playing && (wumsts = !1, c = "Your length", e = "of", J = "Your rank", "de" == lang ? (c = "Deine L\u00e4nge", e = "von", J = "Dein rang") : "fr" == lang ? (c = "Votre longueur", e = "de", J = "Ton rang") : "pt" == lang && (c = "Seu comprimento", e = "do", J = "Seu classifica\u00e7\u00e3o"), c = "" + ('<span style="font-size: 14px;"><span style="opacity: .4;">' + c + ': </span><span style="opacity: .8; font-weight: bold;">' +
                Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1 + "</span></span>"), c += '<BR><span style="opacity: .3;">' + J + ': </span><span style="opacity: .35;">' + rank + '</span><span style="opacity: .3;"> ' + e + ' </span><span style="opacity: .35;">' + snake_count + "</span>", lbf.innerHTML = c);
            b.restore()

        }
}
    };//}}}

V.gen_colors_ = function() { // {{{
	if(complex_colors) {
		rrs = [192, 144, 128, 128, 238, 255, 255, 255, 224, 255, 144, 80, 255, 40, 100, 120, 72, 160, 255, 56, 56, 78, 255, 101, 128, 60, 0, 217, 255, 144, 32, 240, 240, 240, 240, 32], 
		ggs = [128, 153, 208, 255, 238, 160, 144, 64, 48, 255, 153, 80, 192, 136, 117, 134, 84, 80, 224, 68, 68, 35, 86, 200, 132, 192, 255, 69, 64, 144, 32, 32, 240, 144, 32, 240], 
		bbs = [255, 255, 208, 128, 112, 96, 144, 64, 224, 255, 255, 80, 80, 96, 255, 255, 255, 255, 64, 255, 255, 192, 9, 232,
			144, 72, 83, 69, 64, 144, 240, 32, 32, 32, 240, 32];
	} else {
		rrs = [255, 0, 0], 
		ggs = [0, 255, 0], 
		bbs = [0, 0, 255];

		rrs = [0, 144, 128, 128, 238, 255, 255, 255, 224, 255, 144, 80, 255, 40, 100, 120, 72, 160, 255, 56, 56, 78, 255, 101, 128, 60, 0, 217, 255, 144, 32, 240, 240, 240, 240, 32], 
		ggs = [0, 153, 208, 255, 238, 160, 144, 64, 48, 255, 153, 80, 192, 136, 117, 134, 84, 80, 224, 68, 68, 35, 86, 200, 132, 192, 255, 69, 64, 144, 32, 32, 240, 144, 32, 240], 
		bbs = [255, 255, 208, 128, 112, 96, 144, 64, 224, 255, 255, 80, 80, 96, 255, 255, 255, 255, 64, 255, 255, 192, 9, 232,
			144, 72, 83, 69, 64, 144, 240, 32, 32, 32, 240, 32];
	}
	pbx = new Float32Array(32767), pby = new Float32Array(32767), pba = new Float32Array(32767), pbu = new Uint8Array(32767), 
	per_color_imgs_ = [], 
	max_skin_cv = 58;
	for (i = 0; i < rrs.length; i++) {
		o = {
			imgs: [],
			fws: [],
			fhs: [],
			fw2s: [],
			fh2s: [],
			gimgs: [],
			gfws: [],
			gfhs: [],
			gfw2s: [],
			gfh2s: [],
			oimgs: [],
			ofws: [],
			ofhs: [],
			ofw2s: [],
			ofh2s: []
		};
		var rs = "00" + rrs[i].toString(16),
			gs = "00" + ggs[i].toString(16),
			bs = "00" + bbs[i].toString(16),
			rs = rs.substr(rs.length - 2),
			gs = gs.substr(gs.length - 2),
			bs = bs.substr(bs.length - 2);
		o.cs = "#" + rs + gs + bs;
		var sz = 62,
			kfmc = document.createElement("canvas");
		kfmc.width = kfmc.height = sz;
		ctx = kfmc.getContext("2d");
		map = ctx.getImageData(0,
			0, sz, sz);
		imgd = map.data;
		l = imgd.length;
		yy = xx = 0;
		var fi = i;
		44 == i ? fi = 9 : 53 == i ? fi = 15 : 54 == i ? fi = 7 : 55 == i ? fi = 4 : 56 == i ? fi = 5 : 57 == i ? fi = 0 : 58 == i && (fi = 3);
		for (p = 0; p < l; p += 4) v = Math.abs(Math.sqrt(Math.pow(sz / 2 - xx, 2) + Math.pow(sz / 2 - yy, 2)) - 16), v = 15 >= v ? 1 - v / 15 : 0, imgd[p] = rrs[fi], imgd[p + 1] = ggs[fi], imgd[p + 2] = bbs[fi], imgd[p + 3] = Math.floor(255 * v), xx++, xx >= sz && (xx = 0, yy++);
		ctx.putImageData(map, 0, 0);
		o.kfmc = kfmc;
		var ksz = 48,
			ksz2 = ksz / 2,
			kmc = document.createElement("canvas");
		kmc.width = kmc.height = ksz;
		ctx = kmc.getContext("2d");
		ctx.fillStyle =
			"#FFFFFF";
		ctx.arc(ksz2, ksz2, ksz2, 0, pi2);
		ctx.fill();
		map = ctx.getImageData(0, 0, ksz, ksz);
		imgd = map.data;
		l = imgd.length;
		yy = xx = 0;
		var jk = 7,
			kmcs = [];
		for (j = 0; 7 > j; j++) {
			for (p = xx = yy = 0; p < l; p += 4) {
				var v = Math.pow(Math.max(0, Math.min(1, 1 - Math.abs(yy - ksz2) / ksz2)), .35),
					v2 = Math.max(0, Math.min(1, 1 - Math.sqrt(Math.pow(xx - ksz2, 2) + Math.pow(yy - ksz2, 2)) / 34)),
					v = v + .375 * (v2 - v);
				rr = rrs[i];
				gg = ggs[i];
				bb = bbs[i];
				24 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(1.05 * v2, 4), 1 < v2 && (v2 = 1), rr += (306 - rr) *
					v2, gg += (192 * 1.2 - gg) * v2, bb += (76.8 - bb) * v2, v *= 1.22 - .44 * j / 6) : 26 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v *= 1.22 - .44 * j / 6, rr *= v, gg *= v, bb *= v, v = 1, rr += (140.8 - rr) * v2, gg += (280.5 - gg) * v2, bb += (136 * 1.1 - bb) * v2) : 27 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v *= 1.22 - .44 * j / 6, rr *= v, gg *= v, bb *= v, v = 1, rr += (217 * 1.1 - rr) * v2, gg += (75.9 - gg) * v2, bb += (75.9 - bb) * v2) : 28 == i ? (v2 = .5 - .5 * Math.cos(Math.PI * j / 7), rr += (128 -
						rr) * v2, gg += (128 - gg) * v2, bb += (255 - bb) * v2, v *= 1.1, 1 < v && (v = 1)) : 29 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v *= 1.44 - .88 * j / 6, rr = 32 * v, gg = 32 * v, bb = 32 * v, v = 1, rr += (255 - rr) * v2, gg += (255 - gg) * v2, bb += (255 - bb) * v2) : 30 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v = (.1 + .9 * j / jk) % 1, rr = 80 * v, gg = 80 * v, bb = 128 + 160 * v, rr += .3 * (255 - rr) * v2, gg += .3 * (255 - gg) * v2, bb += .3 * (357 - bb) * v2, v = 1) : 31 == i ? (v2 = Math.sqrt(Math.pow(.5 *
							(xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v = (.1 + .9 * j / jk) % 1, rr = 128 + 160 * v, gg = 80 * v, bb = 80 * v, rr += .3 * (357 - rr) * v2, gg += .3 * (255 - gg) * v2, bb += .3 * (255 - bb) * v2, v = 1) : 32 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v = (.1 + .9 * j / jk) % 1, rr = 96 + 128 * v, gg = 96 + 128 * v, bb = 80 * v, rr += .6 * (306 - rr) * v2, gg += .6 * (306 - gg) * v2, bb += .6 * (255 - bb) * v2, v = 1) : 33 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 =
								1), v = (.1 + .9 * j / jk) % 1, rr = 96 + 128 * v, gg = 48 + 80 * v, bb = 48 * v, rr += .6 * (306 - rr) * v2, gg += .6 * (280.5 - gg) * v2, bb += .6 * (255 - bb) * v2, v = 1) : 34 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v = (.1 + .9 * j / jk) % 1, rr = 96 + 128 * v, gg = 80 * v, bb = 96 + 128 * v, rr += .6 * (306 - rr) * v2, gg += .6 * (255 - gg) * v2, bb += .6 * (306 - bb) * v2, v = 1) : 35 == i ? (v2 = Math.sqrt(Math.pow(.5 * (xx - ksz2), 2) + Math.pow(1 * (yy - ksz2), 2)) / ksz2, v2 = Math.pow(v2, 2), 1 < v2 && (v2 = 1), v = (.1 + .9 * j / jk) % 1, rr = 80 * v, gg = 96 + 128 * v, bb = 80 * v, rr += .6 * (255 - rr) * v2,
									gg += .6 * (306 - gg) * v2, bb += .6 * (255 - bb) * v2, v = 1) : v *= 1.22 - .44 * j / 6;
				imgd[p] = Math.max(0, Math.min(255, Math.floor(rr * v)));
				imgd[p + 1] = Math.max(0, Math.min(255, Math.floor(gg * v)));
				imgd[p + 2] = Math.max(0, Math.min(255, Math.floor(bb * v)));
				xx++;
				xx >= ksz && (xx = 0, yy++)
			}
			ctx.putImageData(map, 0, 0);
			var kmc2 = document.createElement("canvas");
			kmc2.width = kmc2.height = ksz;
			var ctx2 = kmc2.getContext("2d");
			ctx2.drawImage(kmc, 0, 0);
			if (10 == i)
				for (k = -1; 1 >= k; k++) {
					var tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 8) * 13,
						ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI *
							k / 8) * 13;
					ctx2.fillStyle = "#FFFFFF";
					ctx2.beginPath();
					for (m = 0; 5 >= m; m++) xx = tx + ksz / 32 * Math.cos(2 * Math.PI * m / 5) * .05 * 24, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * m / 5) * .05 * 24, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz / 32 * Math.cos(2 * Math.PI * (m + .5) / 5) * 3.1, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * (m + .5) / 5) * 3.1, ctx2.lineTo(xx, yy);
					ctx2.fill()
				} else if (19 == i)
				for (k = -2; 2 >= k; k++) {
					tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 15) * 13;
					ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 15) * 13;
					ctx2.save();
					ctx2.globalAlpha = .7;
					ctx2.fillStyle = "#FFFFFF";
					ctx2.beginPath();
					for (m = 0; 5 >= m; m++) xx = tx + ksz / 32 * Math.cos(2 * Math.PI * m / 5) * .05 * 12, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * m / 5) * .05 * 12, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz / 32 * Math.cos(2 * Math.PI * (m + .5) / 5) * 1.55, yy = ty + ksz / 32 * Math.sin(2 * Math.PI * (m + .5) / 5) * 1.55, ctx2.lineTo(xx, yy);
					ctx2.fill();
					ctx2.restore()
				} else if (20 == i)
				for (k = -1.5; 1.5 >= k; k++) {
					tx = ksz2 + ksz2 / 16 * Math.cos(2 * Math.PI * k / 15) * 13;
					ty = ksz2 + ksz2 / 16 * Math.sin(2 * Math.PI * k / 15) * 13;
					ctx2.save();
					ctx2.globalAlpha = .7;
					ctx2.fillStyle = "#FFFFFF";
					ctx2.beginPath();
					for (m = 0; 5 >= m; m++) xx =
						tx + ksz2 / 16 * Math.cos(2 * Math.PI * m / 5) * .05 * 14, yy = ty + ksz2 / 16 * Math.sin(2 * Math.PI * m / 5) * .05 * 14, 0 == m ? ctx2.moveTo(xx, yy) : ctx2.lineTo(xx, yy), xx = tx + ksz2 / 16 * Math.cos(2 * Math.PI * (m + .5) / 5) * 1.8, yy = ty + ksz2 / 16 * Math.sin(2 * Math.PI * (m + .5) / 5) * 1.8, ctx2.lineTo(xx, yy);
					ctx2.fill();
					ctx2.restore()
				}
			kmcs.push(kmc2)
		}
		o.kmcs = kmcs;
		per_color_imgs_.push(o);
		for (j = 2.8; 18.8 >= j; j += 1) {
			var cc = document.createElement("canvas"),
				sz = Math.ceil(2.5 * j + 28);
			cc.width = cc.height = sz;
			ctx = cc.getContext("2d");
			ctx.fillStyle = o.cs;
			ctx.arc(sz / 2, sz / 2, .65 * j, 0, pi2);
			// >>>>>>>>>>>
			// Food Shadow
			if(food_shadow) {
				ctx.shadowBlur = 12;
				ctx.shadowOffsetY = 0;
				ctx.shadowColor = "#" + rs + gs + bs;
				ctx.globalAlpha = .8;
				ctx.fill();
			}
			// <<<<<<<<<<<
			ctx.globalAlpha = 1;
			ctx.fill();
			o.imgs.push(cc);
			o.fws.push(sz);
			o.fhs.push(sz);
			o.fw2s.push(sz / 2);
			o.fh2s.push(sz / 2);
			sz = Math.ceil(8 * j + 6);
			cc = document.createElement("canvas");
			cc.width = cc.height = sz;
			ctx = cc.getContext("2d");
			g = ctx.createRadialGradient(sz / 2, sz / 2, 1, sz / 2, sz / 2, 4 * j);
			g.addColorStop(0, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 1)");
			g.addColorStop(1, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 0)");
			ctx.fillStyle =
				g;
			ctx.fillRect(0, 0, sz, sz);
			o.gimgs.push(cc);
			o.gfws.push(sz);
			o.gfhs.push(sz);
			o.gfw2s.push(sz / 2);
			o.gfh2s.push(sz / 2);
			cc = document.createElement("canvas");
			sz = Math.ceil(1.3 * j + 6);
			cc.width = cc.height = sz;
			ctx = cc.getContext("2d");
			var eam = .2,
				g = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, j / 2);
			g.addColorStop(0, "rgba(" + rrs[i] + ", " + ggs[i] + ", " + bbs[i] + ", 1)");
			g.addColorStop(.99, "rgba(" + Math.floor(rrs[i] * eam) + ", " + Math.floor(ggs[i] * eam) + ", " + Math.floor(bbs[i] * eam) + ", 1)");
			g.addColorStop(1, "rgba(" + Math.floor(rrs[i] *
				eam) + ", " + Math.floor(ggs[i] * eam) + ", " + Math.floor(bbs[i] * eam) + ", 0)");
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, sz, sz);
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 2;
			ctx.arc(sz / 2, sz / 2, .65 * j, 0, pi2);
			ctx.globalAlpha = 1;
			ctx.stroke();
			o.oimgs.push(cc);
			o.ofws.push(sz);
			o.ofhs.push(sz);
			o.ofw2s.push(sz / 2);
			o.ofh2s.push(sz / 2)
		}
		o.ic = o.imgs.length;
		o.pr_imgs = [];
		o.pr_fws = [];
		o.pr_fhs = [];
		o.pr_fw2s = [];
		o.pr_fh2s = [];
		for (j = 3; 24 >= j; j += 1) cc = document.createElement("canvas"), sz = Math.ceil(2 * j + 38), cc.width = cc.height = sz, ctx = cc.getContext("2d"),
			ctx.fillStyle = o.cs, ctx.arc(sz / 2, sz / 2, j / 2, 0, pi2), ctx.shadowBlur = 22, ctx.shadowOffsetY = 0, ctx.shadowColor = "#" + rs + gs + bs, ctx.fill(), ctx.fill(), o.pr_imgs.push(cc), o.pr_fws.push(sz), o.pr_fhs.push(sz), o.pr_fw2s.push(sz / 2), o.pr_fh2s.push(sz / 2)
	}
} // }}}

