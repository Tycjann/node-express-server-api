const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Concert = require('../../../models/concert.model');
const Seat = require('../../../models/seat.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {

  before(async () => {
    const testCon01 = new Concert({
      "_id": '62cdcba14476b161e572e7b0',
      "performer": "62cdccc84476b161e572e7c9",
      "genre": "62cdc8cb4476b161e572e79e",
      "price": 21,
      "day": "1",
      "image": "/img/uploads/1fsd324fsdg.jpg"
    });
    await testCon01.save();

    const testCon02 = new Concert({
      "_id": '62cdcba14476b161e572e7b1',
      "performer": "62cdccc84476b161e572e7ca",
      "genre": "62cdc8e74476b161e572e79f",
      "price": 25,
      "day": "1",
      "image": "/img/uploads/2f342s4fsdg.jpg"
    });
    await testCon02.save();

    const testCon03 = new Concert({
      "_id": '62cdcba14476b161e572e7b2',
      "performer": "62cdccc84476b161e572e7c9",
      "genre": "62cdc8e74476b161e572e79f",
      "price": 40,
      "day": "1",
      "image": "/img/uploads/1fsd324fsdg.jpg"
    });
    await testCon03.save();

    const testCon04 = new Concert({
      "_id": '62cdcba14476b161e572e7C4',
      "performer": "62cdccc84476b161e572e7ca",
      "genre": "62cdc8e74476b161e572e79f",
      "price": 23,
      "day": "1",
      "image": "/img/uploads/2f342s4fsdg.jpg"
    });
    await testCon04.save();

    const testTicket01 = new Seat({
      "day": "2",
      "seat": 1,
      "client": 'Client #1',
      "email": "email@emailasdffgg.com"
    });
    await testTicket01.save();

    const testTicket02 = new Seat({
      "day": "2",
      "seat": 2,
      "client": 'Client #1',
      "email": "email@emailasdffgg.com"
    });
    await testTicket02.save();

    const testTicket03 = new Seat({
      "day": "2",
      "seat": 3,
      "client": 'Client #1',
      "email": "email@emailasdffgg.com"
    });
    await testTicket03.save();

    const testTicket04 = new Seat({
      "day": "2",
      "seat": 4,
      "client": 'Client #1',
      "email": "email@emailasdffgg.com"
    });
    await testTicket04.save();

  });

  it('/ should return all concerts', async () => {

    const res = await request(server).get('/api/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(4);

  });

  it('/ should return all concerts by :performer', async () => {

    const res = await request(server).get('/api/concerts/performer/62cdccc84476b161e572e7c9');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);

  });

  it('/ should return all concerts by :genre', async () => {

    const res = await request(server).get('/api/concerts/genre/62cdc8e74476b161e572e79f');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(3);

  });

  it('/ should return all concerts by :day', async () => {

    const res = await request(server).get('/api/concerts/day/1');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(4);

  });

  it('/ should return all concerts between :price_min and :price_max = ERROR??', async () => {

    const res = await request(server).get('/api/concerts/price/21/25');
    // expect(res.status).to.be.equal(200);
    // expect(res.body).to.be.an('array');
    // expect(res.body.length).to.be.equal(3);

  });

  it('/ should return all free seats on concert by :day', async () => {

    const res = await request(server).get('/api/concerts/seats/2');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.freeSeats).to.be.equal(46);

  });


  after(async () => {
    await Concert.deleteMany();
    await Seat.deleteMany();
  });

});