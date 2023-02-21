import { faker } from "@faker-js/faker"
import '@bahmutov/cy-api'
const users = require("../fixtures/users.json");
const box = require("../fixtures/boxData.json")
let boxKey;
const boxName = faker.name.jobArea();
const boxNameBackSpace = '';
const boxNameAlphaNumericSpecial = 'QWER123±!@';
const boxNameAlphaNumericbackspace = 'test 123';
const boxKeyMore64 = 'QWERTYUIOPasdfghjklZXCVBNM_QWERTYUIOPasdfghjklZXCVBNM_QWERTYUIOPasdfghjklZXCVBNM';
const boxNameMore256 = 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcv';
const boxNameSpecialSymbols = '±!@#$%^&*(){}:[]:~<>?';
const boxKeySpecialSymbols = '§±!@#$%^&*()_+-=:;\|~`<>?/';
const boxKeyWithBackspace = 'Test 123';
const boxKeyBackspaceMore6 = '       ';

// Positive
describe('AS-6 Site login & password change', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })
  it('password change to new password API', () => {
    cy.api({ 
      url: '/api/account/password',
      failOnStatusCode: false,
      method: 'PUT',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    })
  it('password change to initial password API', () => {
    cy.api({ 
      url: '/api/account/password',
      failOnStatusCode: false,
      method: 'PUT',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    })

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      failOnStatusCode: false,
      method: 'GET',        
      headers: {
        Cookies: cookie_connect_sid
        },
      body: {
        password: users.user1.password
        }
      }).then((responce) => {
        expect(responce.status).to.equal(200);
      })
    })
  })

describe('AS-27 Box Creation & AS-28 Box adjustment & AS-29 Delete Box', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.newpassword
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: boxKey,
        picture: box.box1.picture,
        usePost: box.box1.usePost,
        useCashLimit: box.box1.useCashLimit,
        cashLimit: box.box1.cashLimit,
        cashLimitCurrency: box.box1.cashLimitCurrency,
        useWish: box.box1.useWish,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: box.box1.useNames,
        isPhoneRequired: box.box1.isPhoneRequired,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        }).then((response) => {
        expect(response.body.box.picture).to.contain('gift');
        expect(response.body.box.useCashLimit).to.be.true;
        expect(response.body.box.cashLimit).to.equal(1);
        expect(response.body.box.cashLimitCurrency).to.contain('rub');
      });
    });

  it('AS-28 Box adjustment', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'PUT',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: boxKey,
        picture: box.box2.picture,
        usePost: box.box1.usePost,
        useCashLimit: box.box2.useCashLimit,
        cashLimit: box.box2.cashLimit,
        cashLimitCurrency: box.box2.cashLimitCurrency,
        useWish: box.box2.useWish,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: box.box2.useNames,
        isPhoneRequired: box.box1.isPhoneRequired,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.box.picture).to.contain('cup_one');
        expect(response.body.box.useCashLimit).to.be.true;;
        expect(response.body.box.cashLimit).to.equal(1000);
        expect(response.body.box.cashLimitCurrency).to.contain('eur');
      })
    });

  it('AS-29 Delete Box', () => { 
    cy.api({ 
      url: '/api/box/'+boxKey,
      failOnStatusCode: false,
      method: 'DELETE',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
        boxKey = body,
      );
  })

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-30 Create Box Name (backspace 1 symbol)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxNameBackSpace,
        key: boxKey,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-32 Create Box (name - alphanumeric and backspace)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxNameAlphaNumericbackspace,
        key: boxKey,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-33 Create Box Name (special symbols)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxNameAlphaNumericSpecial,
        key: boxKey,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-22 Create box (name - special symbols without quotes)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxNameSpecialSymbols,
        key: boxKey,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

// Negative
describe('AS-9 Login (correct login & no password)', () => {

  const users = require("../fixtures/users.json");
  // let wrongpassword = faker.word.adjective( { lenght: {min: 8, min: 20}} )

  it('no login & correct password', () => {
    cy.request({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: ' ',
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].field).to.contains('email')
      });
    })
})

describe('AS-11 Login (correct login & incorrect password)', () => {

  const users = require("../fixtures/users.json");
  // let wrongpassword = faker.word.adjective( { lenght: {min: 8, min: 20}} )

  it('no login & correct password', () => {
    cy.request({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.newpassword
        }
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('INVALID_USERNAME_OR_PASSWORD')
      });
    })
})

describe('AS-12 Login (no login & correct password)', () => {

  const users = require("../fixtures/users.json");
  // let wrongpassword = faker.word.adjective( { lenght: {min: 8, min: 20}} )

  it('no login & correct password', () => {
    cy.request({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: '' , 
        password: users.user1.password 
        }
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid')
        expect(response.body.error.errors[0].field).to.contains('email')
      });
    })
})

describe('AS-15 Login (no login & no password)', () => {

  const users = require("../fixtures/users.json");
  // let wrongpassword = faker.word.adjective( { lenght: {min: 8, min: 20}} )

  it('no login & no password', () => {
    cy.request({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: '' ,
        password: '' 
        }
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid')
        expect(response.body.error.errors[0].field).to.contains('email')
        expect(response.body.error.errors[1].field).to.contains('password')
      });
    })
})

describe('AS-16 Login (incorrect login & correct password)', () => {

  const users = require("../fixtures/users.json");
  // let wrongpassword = faker.word.adjective( { lenght: {min: 8, min: 20}} )

it('incorrect login & correct password', () => {
  cy.request({ 
    url: '/api/login',
    failOnStatusCode: false,
    method: 'POST',
    body: {
      email:  faker.internet.email(),
      password: users.user1.password 
      }
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body.error.message).to.contains('USER_NOT_FOUND')
    });
  })
})

describe('AS-17 Create box (no key)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: null,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].field).to.contains('key')
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-18 Create box (no name)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: null,
        key: boxKey,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.invalidTyp')
        expect(response.body.error.errors[0].field).to.contains('name')
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-19 Create box (no key & no name)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: null,
        key: null,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.invalidType')
        expect(response.body.error.errors[0].field).to.contains('name')
        expect(response.body.error.errors[1].transKey).to.contains('validations.invalidType')
        expect(response.body.error.errors[1].field).to.contains('key')

        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-20 Create Box (name > 256)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxNameMore256,
        key: boxKey,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.maxCharLength')
        expect(response.body.error.errors[0].field).to.contains('name')
        expect(response.body.error.errors[0].params.max).to.equal(256)
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-21 Create Box (key > 64)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: boxKeyMore64,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.maxCharLength')
        expect(response.body.error.errors[0].field).to.contains('key')
        expect(response.body.error.errors[0].params.max).to.equal(64)
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-23 Create box (key - special symbols withoud quotes)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: boxKeySpecialSymbols,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.invalidBoxKey')
        expect(response.body.error.errors[0].field).to.contain('key')
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-24 Create Box (key - alphanumeric and backspace)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: boxKeyBackspaceMore6,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.invalidBoxKey')
        expect(response.body.error.errors[0].field).to.contain('key')
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
})

describe('AS-31 Create Box (key - with backspases)', () => {
  let cookie_connect_sid;
  it('login', () => {
    cy.api({ 
      url: '/api/login',
      failOnStatusCode: false,
      method: 'POST',
      body: {
        email: users.user1.email,
        password: users.user1.password
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    cy.getCookie('connect.sid').then((cook) => {
      cookie_connect_sid = (`${cook.name}=${cook.value}`)
      })
    })

  it('AS-27 Box Creation - Key', () => { 
    cy.api({ 
      url: '/api/box/key',
      failOnStatusCode: false,
      method: 'GET',
      headers: {
        Cookie: cookie_connect_sid
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
      }).then(({body}) =>
      boxKey = body
      );
    })

  it('AS-27 Box Creation', () => {
    cy.api({
      url: '/api/box',
      failOnStatusCode: false,
      method: 'POST',
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        email: null,
        name: boxName,
        key: boxKeyWithBackspace,
        picture: null,
        usePost: false,
        useCashLimit: null,
        cashLimit: null,
        cashLimitCurrency: null,
        useWish: null,
        useCircleDraw: null,
        isInviteAfterDraw: null,
        isArchived: null,
        createAdminCard: null,
        isCreated: null,
        useNames: null,
        isPhoneRequired: false,
        logo: null,
        },
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error.message).to.contains('validations.invalid');
        expect(response.body.error.errors[0].transKey).to.contains('validations.invalidBoxKey')
        expect(response.body.error.errors[0].field).to.contain('key')
        })
      });

  it('logout', () => {
    cy.api({
      url: '/api/logout',
      method: 'GET',        
      headers: {
        Cookie: cookie_connect_sid
        },
      body: {
        password: users.user1.newpassword
        }
    }).then((responce) => {
      expect(responce.status).to.equal(200);
    })
    })
}) 