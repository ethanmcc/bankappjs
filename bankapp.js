function EmailService() {}

EmailService.prototype.notify = function(message) {};

function DBService() {}

DBService.prototype.authenticate = function(pin) {};

function CheckingAccount(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.balance = 0;
    this.verified = false;
}

CheckingAccount.prototype.deposit = function(amount) {
    this.balance += amount;
};

CheckingAccount.prototype.withdraw = function(amount) {
    if (amount <= this.balance) {
        this.deposit(-amount);
    } else {
        var email = new EmailService();
        email.notify('Your account has been overdrawn.');
    }
};

CheckingAccount.prototype.verifyPin = function(pin) {
    db = new DBService();
    this.verified = db.authenticate(pin);
    return this.verified;
};

module.exports = {
    'EmailService': EmailService,
    'DBService': DBService,
    'CheckingAccount': CheckingAccount
}
