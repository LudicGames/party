import Box2D from 'ludic-box2d';

export default class Goal {
  constructor(x, y, width = 1, height = 2, color, world, active = true, priority = -1){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.createB2D(world);
  }

  createB2D(world){
    let bd = new Box2D.b2BodyDef();
    bd.set_position(new Box2D.b2Vec2(this.x, this.y));
    this.body = world.CreateBody(bd);

    let shape = new Box2D.b2PolygonShape();
    shape.SetAsBox(this.width / 2, this.height / 2);
    this.fixture = this.body.CreateFixture(shape, 0.0);
    this.fixture.SetDensity(1.0);
    this.body.ResetMassData();
  }

  getPosition(easyRead){
    let pos;

    this.pos = this.body.GetPosition();

    if(easyRead){
      pos = {
        x:this.pos.get_x(),
        y:this.pos.get_y()
      };
    } else {
      pos = this.pos;
    }
    return pos;
  }

  draw(ctx){
    let pos = this.getPosition(true);
    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.body.GetAngle());
    ctx.translate(-(pos.x), -(pos.y));
    ctx.fillStyle = this.color;
    ctx.fillRect(pos.x - this.width / 2, pos.y - this.height / 2, this.width, this.height);
  }
};
