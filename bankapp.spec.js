var bank = require('./bankapp.js'),
    sinon = require('sinon');

describe('checking account', function() {
    beforeEach(function() {
        this.account = new bank.CheckingAccount(
            'Arin',
            'Sime'
        );
    });

    it('should have first name', function() {
        expect(this.account.firstName).toBe('Arin');
    });

    it('should have last name', function() {
        expect(this.account.lastName).toBe('Sime');
    });

    it('should have zero balance', function() {
        expect(this.account.balance).toBe(0);
    });

    it('should be unverified', function() {
        expect(this.account.verified).toBeFalsy();
    });
});


describe('when withdrawing funds', function() {
    beforeEach(function() {
        this.account = new bank.CheckingAccount(
            'Arin',
            'Sime'
        );
    });

    describe('when existing balance', function() {
        it('should withdraw successfully', function() {
            this.account.balance = 100;
            this.account.withdraw(50);
            expect(this.account.balance).toBe(50);
        });
    });

    describe('multiple withdrawals', function() {
        it('should adjust balance', function() {
            this.account.deposit(45.45);
            this.account.withdraw(25);
            this.account.deposit(50);
            this.account.withdraw(10.25);
            this.account.deposit(12.73);
            expect(this.account.balance).toBe(72.93);
        });
    });

    describe('when overwithdrawaling', function() {
        it('should prevent withdraw', function() {
            var notify = sinon.spy(bank.EmailService.prototype, 'notify');
            this.account.balance = 25;
            this.account.withdraw(50);
            expect(notify.calledWith('Your account has been overdrawn.'))
                .toBeTruthy();
            expect(this.account.balance).toBe(25);
            notify.restore();
        });
    });
});


describe('when authenticating against DB', function() {
    beforeEach(function() {
        this.account = new bank.CheckingAccount(
            'Arin',
            'Sime'
        );
        this.authenticate = sinon.stub(
            bank.DBService.prototype, 'authenticate');
    });

    afterEach(function() {
        bank.DBService.prototype.authenticate.restore();
    });

    it('should set validation false on failure', function() {
        this.authenticate.returns(false);
        this.account.verifyPin('1234');
        expect(this.account.verified).toBeFalsy();
    });

    it('should set validation true on success', function() {
        this.authenticate.returns(true);
        this.account.verifyPin('1234');
        expect(this.account.verified).toBeTruthy();
    });

    it('should return status on failure', function() {
        this.authenticate.returns(false);
        var result = this.account.verifyPin('1234');
        expect(result).toBeFalsy();
    });

    it('should return status on success', function() {
        this.authenticate.returns(true);
        var result = this.account.verifyPin('1234');
        expect(result).toBeTruthy();
    });
});


describe('when checking balance', function() {
    beforeEach(function() {
        this.account = new bank.CheckingAccount(
            'Arin',
            'Sime'
        );
        this.account.balance = 50;
    });

    it('should have fifty dollar balance', function() {
        expect(this.account.balance).toBe(50);
    });
});


describe('when depositing funds', function() {
    beforeEach(function() {
        this.account = new bank.CheckingAccount(
            'Arin',
            'Sime'
        );
    });

    describe('when starting balance is zero', function() {
        it('should have $100 balance', function() {
            this.account.deposit(100);
            expect(this.account.balance).toBe(100);
        });
    });

    describe('when starting balance is zero', function() {
        it('should have $100 balance', function() {
            this.account.deposit(43.42);
            expect(this.account.balance).toBe(43.42);
        });
    });

    describe('when arbitraty values', function() {
        it('should have $100 balance', function() {
            this.account.balance = 100;
            this.account.deposit(250.24);
            expect(this.account.balance).toBe(350.24);
        });
    });

    describe('when arbitraty values', function() {
        it('should have $100 balance', function() {
            this.account.balance = 23.42;
            this.account.deposit(100);
            expect(this.account.balance).toBe(123.42);
        });
    });

    describe('when arbitraty values', function() {
        it('should have $100 balance', function() {
            this.account.balance = 12.41;
            this.account.deposit(55);
            expect(this.account.balance).toBe(67.41);
        });
    });

    describe('when arbitraty values', function() {
        it('should have $100 balance', function() {
            this.account.balance = 67.89;
            this.account.deposit(10.25);
            expect(this.account.balance).toBe(78.14);
        });
    });

    describe('when multiple deposits', function() {
        it('should have $100 balance', function() {
            this.account.deposit(45.45);
            this.account.deposit(50);
            this.account.deposit(12.73);
            expect(this.account.balance).toBe(108.18);
        });
    });
});
