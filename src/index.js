var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = 'amzn1.ask.skill.61d18cf5-9cb4-4b7d-a2f7-34fb7146ee0d';
    alexa.dynamoDBTableName = 'MrFarmerNames'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var animalNoises = {
    "cow": "moo",
    "cockerel": "cock a doodle doo",
    "cock": "cock a doodle doo",
    "snake": "hiss",
    "duck": "honk"
}

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },
    
    'Introduction': function () {
        var myName = this.event.request.intent.slots.firstname.value;
        this.attributes['name'] = myName;
        this.emit(':ask', 'hello, ' + myName, 'try again');
    },
    
    'WhatNoise': function () {
        var myName = '';
        if (this.attributes['name']) {
            myName = this.attributes['name'];
        }
        var animal = this.event.request.intent.slots.animal.value;
        var noise;
        var say = `Hi ${myName}, A ${animal} says <say-as interpret-as="interjection">${animalNoises[animal]}</say-as>`;
        
        this.emit(':ask', say, 'try again');
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'Introduce yourself by saying my name is..., and then your name. Then you can ask me what noise an animal of your choice makes');
    },

    'AMAZON.StopIntent': function () {
        var myName = '';
        if (this.attributes['name']) {
            myName = this.attributes['name'];
        }
        this.emit(':tell', 'goodbye, ' + myName);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Request cancelled');
    }
};