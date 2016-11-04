var app = {
    options: {
        numAdults: 1,
        numChildren: 1
    }
}

function makeList(){
    var family = {};

    $('.button-frame').addClass('pushed');

    function parseList(family) {
        var newList = [];
        var givingList = [];
        var adultsReceivingList = [];
        var kidsReceivingList = [];
        var people = family.people;

        // make sure everyone who is giving is matched with 1-2 people (only 2 if the giver is an adult, and the pair should be adult-child)

        for (var i=0; i<people.length;i++){
            // make a list of everyone who is giving
            if (people[i].giving) {
                givingList.push(people[i].name);
            }

            if (people[i].receiving) {
                if (people[i].age == 'adult') {
                    // make a list of all adults who are receiving gifts
                    adultsReceivingList.push(people[i].name);
                } else {
                    // make a list of all kids receiving gifts
                    kidsReceivingList.push(people[i].name);
                }
            }
        }

        function assignGivers(receivingArray, age) {


            for (var j=0; j<receivingArray.length; j++) {
                var randomNumber = Math.floor(Math.random() * givingList.length);
                var selectedPerson = givingList[randomNumber];

                function eligible(selectedPerson) {
                    if (receivingArray[j] == selectedPerson) {
                        console.log('Same person!');
                        return false;
                    }

                    if (newList.length > 0) {
                        var selectedObj = $.map(newList, function (obj, index) {
                            if (obj.name == selectedPerson) {
                                return obj;
                            }
                        });

                        if (selectedObj.length > 0) {
                            //console.log(selectedObj);
                            if ((selectedObj[0].givingTo.length < 2) && (selectedObj[0].givingTo[0].age != age) && (selectedObj[0].age == 'adult')) {
                                //console.log(selectedObj[0]);
                                return true;
                            } else {
                                console.log('Giver has already given their maximum.')
                                return false;
                            }
                        }
                    }

                    return true;

                }

                while (!eligible(selectedPerson)){
                    randomNumber = Math.floor(Math.random() * givingList.length);
                    selectedPerson = givingList[randomNumber];
                }

                var personObj = $.map(people, function(obj, index){
                    if (obj.name == selectedPerson) {
                        return obj;
                    }
                });

                var receivingObj = $.map(people, function(obj, index){
                    if (obj.name == receivingArray[j]) {
                        return obj;
                    }
                });

                var match = $.map(newList, function(obj, index){
                    if (obj.name == selectedPerson) {
                        return obj;
                    }
                });

                if (match.length > 0){
                    //console.log('match',match[0]);
                    newList[newList.indexOf(match[0])].givingTo.push({name: receivingArray[j], age: receivingObj[0].age});
                } else {
                    newList.push({
                        name: selectedPerson,
                        age: personObj[0].age,
                        givingTo: [{name: receivingArray[j],
                                    age: receivingObj[0].age
                                    }]
                    });
                }
                //console.log(selectedPerson + ' is giving to ' + receivingArray[j]);

            }

        }

        assignGivers(adultsReceivingList, 'adult');
        assignGivers(kidsReceivingList, 'child')

        function compare(a, b){
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        }

        newList.sort(compare);

        var givingMsg = '';

        $('.givingListTable tbody').html('');
        for (var x = 0; x < newList.length; x++) {
            if (newList[x].givingTo.length > 1) {
                givingMsg = newList[x].givingTo[0].name + ' and ' + newList[x].givingTo[1].name;
            } else {
                givingMsg = newList[x].givingTo[0].name;
            }
            console.log(newList[x].name + ' is giving gifts to ' + givingMsg);
            $('.givingListTable tbody').append('<tr><td>' + newList[x].name + ' is giving gifts to ' + givingMsg + '</td></tr>');
        }


    }

    $.ajax({
        url: 'scripts/people.json',
        dataType: 'json',
        success: function(data) {
            family = data;
            parseList(family);
        },
        error: function(jqXHR, textStatus, e){
            console.log('jqXHR', jqXHR);
            console.log('textStatus', textStatus);
            console.log('error',e);
        }
    });

}

$('.makelist').on('click', function(){makeList();});