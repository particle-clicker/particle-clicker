function ParticleEvent(type)
{
    this.type = type;
    this.length = 0;
    this.radius = 0;
    this.direction = 0;
    this.alpha = 1;

    switch (this.type)
    {
        case 'electron':
            this.length = detector.radius.siliconSpace + Math.round((detector.radius.ecal - detector.radius.siliconSpace) * Math.random());
            this.direction = Math.random() * Math.PI * 2;
            this.radius = 20 + Math.round((100 - 20) * Math.random());
            break;
    }

    this.draw(true);
};

ParticleEvent.prototype.draw = function(init)
{
    init = typeof init !== 'undefined' ? init : false;

    var ctx = detector.events.ctx;
    var cx = detector.width / 2;
    var cy = detector.height / 2;

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";

    ctx.translate(cx, cy);
    ctx.rotate(this.direction);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.arc(cx + this.length / 2, cy + Math.round(Math.sqrt(this.radius * this.radius - this.length * this.length / 4)), this.radius, -Math.PI / 2 - Math.asin(this.length / (2 * this.radius)), -Math.PI / 2 +  Math.asin(this.length / (2 * this.radius)), false);
    ctx.stroke();

    ctx.restore();

    if (!init) {
        this.alpha -= 0.02;
    }

    console.log(this.alpha);
};
