import sinon from 'sinon';

export function createMockReq(overrides = {}) {
    return {
        body: {},
        params: {},
        session: {},
        files: null,
        protocol: 'http',
        role: 'admin',
        query: {},
        userId: 1,
        get: sinon.stub().returns('localhost:5001'),
        ...overrides
    };
}

export function createMockRes() {
    const res = {
        statusCode: 200,
        body: null
    };
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
}
