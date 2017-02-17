var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Bengaluru";

var welcomeMessage = location + " Guide. You can ask me for an attraction, or say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, or say help. What will it be?";

var locationOverview = "Bengaluru is the capital of state of Karnataka in India. It has a population of about 8.52 million, making it the third most populous city in India. At a height of over 900 meters above sea level, it is the highest among the major cities of India.  What else would you like to know?";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. What would you like to do?";

var moreInformation = "See your Alexa app for more information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
   {
        name: "Bangalore Palace",
        content: "Construction of this Tudor style palace began in 1862 and completed in 1944. The interiors were decorated with wood carvings, stained glass windows, floral motifs, and old paintings belonging to mid nineteenth century.",
        location : "Palace Road, Near Mount Carmel Institute Of Management, Vasanth Nagar, Jayamahal, Bengaluru",
        contact: "08008537122"},
        {
        name: "Cubbon Park",
        content: "Named after the longest serving commissioner of the time, Sir Mark Cubbon, This beautiful garden was built by the British Chief Engineer of Mysore state, Major General Richard Sankey in the late 19th century. It occupies an area of about 300 acres today and has total 6000 trees of indigenous and exotic botanical species.",
        location : "Behind High Court of Karnataka, Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru",
        contact: "08022864125"
        },
        {name: "Iskcon temple",
        content: "One of the largest iskcon temples in the world, it has deities of Radha and Krishna.  It is situated on top of Hare Krishna Hill.",
        location : "Hare Krishna Hill, Chord Road, Rajaji Nagar, Bengaluru",
        contact: " 08023471956"
        },
        {name: "Lalbagh Botanical Gardens",
        content: "Well known botanical garden, was originally commissioned by Hyder Ali, the ruler of Mysore.   Lalbagh houses largest collection of tropical plants in India.   It has a famous glass house, which hosts flower shows on 26 January and 15 August",
        location : "Mavalli, Bengaluru, Karnataka 560004",
        contact: " 08026578184",
        },
        {
        name: "Nandi Hills",
        content: "Nandi Hills is an ancient hill fortress.   It is 1,479 meters above sea level.  Nandi Hills offers a surprise of breathtaking scenic beauty and excellent climatic condition.",
        location: "10 km from Chickballapur town and approximately 60 km from the city of Bengaluru",
        contact: "081562678621",
        },
];

var topFive = [
    { number: "1", caption: "Visit the up scale MG Road.", more: "MG Road area is a favourite with tourists, offering a diverse range of stores selling everything from traditional handicrafts to silk and even a store for kids. Spencer's super market, Shrungar Shopping Complex, Barton Court and Bombay Swadeshi are the major attractions."},
    { number: "2", caption: "Get shopping done at Commercial Street.", more: "The epicenter of all things commercial in Bangalore, if there is one place where you can get everything from shoes to cars, it is here in Commercial Street"},
    { number: "3", caption: "Eat at Mavalli Tiffin Rooms.", more: "MTR is must visit if you like to taste authentic karnataka food and want to experience a proper meal kind of experience. " },
    { number: "4", caption: "Learn about aeroplanes at H A L.", more: "H A L heritage centre and aerospace museum is a treasure of information about flying and aeroplanes" },
    { number: "5", caption: "Enjoy theatre at Ranga Shankara.", more: "Ranga Shankara theatre hosts theatrical performances 6 days a week.  You will always find finest performances from actors across from India and world" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':askWithCard', output, location, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.location + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
