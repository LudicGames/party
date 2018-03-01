import {BaseEntity} from 'ein'
import {Box2D} from 'ludic-box2d'

export default class Circle extends BaseEntity {
  constructor(x, y, radius = 1, color, world, active = true, priority = -1, isDynamic = true){
    super(active, priority)
    this.x = x
    this.y = y
    this.radius = radius
    this.isDynamic = isDynamic
    this.color = color
    this.current = true
    this.score = 0
    this.createB2D(world)
  }

  createB2D(world){
    let bd = new Box2D.b2BodyDef()
    if(this.isDynamic){
      bd.set_type(Box2D.b2_dynamicBody)
    }
    bd.set_position(new Box2D.b2Vec2(this.x, this.y))
    this.body = world.CreateBody(bd)

    let shape = new Box2D.b2CircleShape()
    shape.set_m_radius(this.radius)

    this.fixture = this.body.CreateFixture(shape, 0.0)
    this.fixture.SetDensity(0)
    this.fixture.SetRestitution(.5)
    this.body.ResetMassData()
  }

  getPosition(easyRead){
    let pos

    this.pos = this.body.GetPosition()

    if(easyRead){
      pos = {
        x:this.pos.get_x(),
        y:this.pos.get_y()
      }
    } else {
      pos = this.pos
    }
    return pos
  }

  draw(ctx){
    let pos = this.getPosition(true)
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()

  }
}
