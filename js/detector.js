var detector =
{
    canvas: {},
    ctx: {},

    ratio: 1,

    colors: 
    {
        siliconRing: '#FFF371',
        siliconRingLine: '#EAC918',
        ecal: '#C5FF82',
        ecalLine: '#9EFF28',
        hcal: '#E1FF79',
        hcalLine: '#C9FF2D',
        lightRing: '#A0B3FF',
        lightRingLine: '#A0B3FF',
        darkRing: '#7280B8',
        darkRingLine: '#7280B8',

        mucalLight: '#FFDFB7',
        mucalLightLine: '#FFDFB7',
        mucalDark: '#EA301F',
        mucalDarkLine: '#C5291A'
    },

    radius:
    {
        siliconInner: 5,
        silicon: 25,
        siliconSpace: 30,
        ecal: 40,
        hcal: 70,
        darkRing1: 73,
        darkRing1Space: 78,
        lightRing: 90,
        lightRingSpace: 92,
        darkRing2: 95,

        mucal: 105,
        mucalLight: 10,
        mucalDark: 20
    },

    init: function()
    {
        detector.canvas = document.getElementById('detector');
        detector.ctx = detector.canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = detector.ctx.webkitBackingStorePixelRatio ||
                                detector.ctx.mozBackingStorePixelRatio ||
                                detector.ctx.msBackingStorePixelRatio ||
                                detector.ctx.oBackingStorePixelRatio ||
                                detector.ctx.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio / backingStoreRatio;

        detector.ratio = detector.canvas.width / 400;

        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = detector.canvas.width;
            var oldHeight = detector.canvas.height;

            detector.canvas.width = oldWidth * ratio;
            detector.canvas.height = oldHeight * ratio;

            detector.canvas.style.width = oldWidth + 'px';
            detector.canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            detector.ctx.scale(ratio, ratio);
        }

        detector.ctx.scale(detector.ratio, detector.ratio);        

        detector.draw();
    },

    draw: function()
    {
        var ctx = detector.ctx;
        var cx = 200;
        var cy = 200;

        //ctx.scale(2,2);

        ctx.strokeRect(0,0,400,400);

        var muSplit = 2/12;
        for (var k = 3; k >= 1; k--) {
            ctx.strokeStyle = detector.colors.mucalDarkLine;
            ctx.fillStyle = detector.colors.mucalDark;
            
            ctx.beginPath();
            ctx.moveTo(cx + (detector.radius.mucal + k * detector.radius.mucalLight + k * detector.radius.mucalDark) * Math.cos(Math.PI * muSplit), cx + (detector.radius.mucal + k * detector.radius.mucalLight + k * detector.radius.mucalDark) * Math.sin(Math.PI * muSplit));
            for (var i = 1; i <= 13; i++) {
                ctx.lineTo(cx + (detector.radius.mucal + k * detector.radius.mucalLight + k * detector.radius.mucalDark) * Math.cos(Math.PI * i * muSplit), cx + (detector.radius.mucal + k * detector.radius.mucalLight + k * detector.radius.mucalDark) * Math.sin(Math.PI * i * muSplit));
            }
            ctx.stroke();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx + (detector.radius.mucal + k * detector.radius.mucalLight + (k-1) * detector.radius.mucalDark) * Math.cos(Math.PI * muSplit), cx + (detector.radius.mucal + k * detector.radius.mucalLight + (k-1) * detector.radius.mucalDark) * Math.sin(Math.PI * muSplit));
            for (var i = 1; i <= 13; i++) {
                ctx.lineTo(cx + (detector.radius.mucal + k * detector.radius.mucalLight + (k-1) * detector.radius.mucalDark) * Math.cos(Math.PI * i * muSplit), cx + (detector.radius.mucal + k * detector.radius.mucalLight + (k-1) * detector.radius.mucalDark) * Math.sin(Math.PI * i * muSplit));
            }
            ctx.stroke();
            ctx.fillStyle = detector.colors.mucalLight;
            ctx.fill();
        }

        ctx.strokeStyle = detector.colors.mucalDarkLine;
        ctx.beginPath();
        ctx.moveTo(cx + detector.radius.mucal * Math.cos(Math.PI * muSplit), cx + detector.radius.mucal * Math.sin(Math.PI * muSplit));
        for (var i = 1; i <= 13; i++) {
            ctx.lineTo(cx + detector.radius.mucal * Math.cos(Math.PI * i * muSplit), cx + detector.radius.mucal * Math.sin(Math.PI * i * muSplit));
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';


        ctx.beginPath();
        ctx.strokeStyle = detector.colors.darkRingLine;
        ctx.fillStyle = detector.colors.darkRing;
        ctx.arc(cx, cy, detector.radius.darkRing2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(cx, cy, detector.radius.lightRingSpace, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        ctx.beginPath();
        ctx.strokeStyle = detector.colors.lightRingLine;
        ctx.fillStyle = detector.colors.lightRing;
        ctx.arc(cx, cy, detector.radius.lightRing, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(cx, cy, detector.radius.darkRing1Space, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        ctx.beginPath();
        ctx.strokeStyle = detector.colors.darkRingLine
        ctx.fillStyle = detector.colors.darkRing;
        ctx.arc(cx, cy, detector.radius.darkRing1, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(cx, cy, detector.radius.ecal, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';


        ctx.strokeStyle = detector.colors.hcalLine;
        ctx.fillStyle = detector.colors.hcal;
        var calSplit = 20/2;
        for (var i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(cx + detector.radius.ecal * Math.cos(Math.PI * i / calSplit), cx + detector.radius.ecal * Math.sin(Math.PI * i / calSplit));
            ctx.lineTo(cx + detector.radius.hcal * Math.cos(Math.PI * i / calSplit), cx + detector.radius.hcal * Math.sin(Math.PI * i / calSplit));
            ctx.arc(cx, cy, detector.radius.hcal, Math.PI * i / calSplit, Math.PI * (i+1) / calSplit, false);
            ctx.lineTo(cx + detector.radius.ecal * Math.cos(Math.PI * (i+1) / calSplit), cx + detector.radius.ecal * Math.sin(Math.PI * (i+1) / calSplit));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.strokeStyle = detector.colors.ecalLine;
        ctx.fillStyle = detector.colors.ecal;
        var calSplit = 20/2;
        for (var i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(cx + detector.radius.siliconSpace * Math.cos(Math.PI * i / calSplit), cx + detector.radius.siliconSpace * Math.sin(Math.PI * i / calSplit));
            ctx.lineTo(cx + detector.radius.ecal * Math.cos(Math.PI * i / calSplit), cx + detector.radius.ecal * Math.sin(Math.PI * i / calSplit));
            ctx.lineTo(cx + detector.radius.ecal * Math.cos(Math.PI * (i+1) / calSplit), cx + detector.radius.ecal * Math.sin(Math.PI * (i+1) / calSplit));
            ctx.lineTo(cx + detector.radius.siliconSpace * Math.cos(Math.PI * (i+1) / calSplit), cx + detector.radius.siliconSpace * Math.sin(Math.PI * (i+1) / calSplit));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.strokeStyle = detector.colors.siliconRingLine;
        ctx.fillStyle = detector.colors.siliconRing;
        ctx.arc(cx, cy, detector.radius.silicon, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = detector.colors.siliconRingLine;
        ctx.fillStyle = detector.colors.siliconRing;
        ctx.arc(cx, cy, detector.radius.siliconInner, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    }
};

(function() { detector.init(); })();
