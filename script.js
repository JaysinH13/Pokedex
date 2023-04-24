
// the code below will get the whole list of the pokemon name. i use xhr instead of jquery is because i can't figured out a way to make it async.
var pokelist = [];
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.response);
        for (let i = 0; i < data.results.length; i++) {
            
            pokelist.push(data.results[i].name);
        }

    }
};
xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon-species/?limit=100000', false);
xhr.send(null);


// this will display the autocomplete for the pokeInput. 
        //sadly because of the css
        //it have to have a lot more addition to it to make a proper autocomplete layout.
        


function formUpdate(value) {
    let input = value
    getDetails(input);
}
function getDetails(input) {
    document.getElementById('newerForms').innerHTML = "";

    //var input = $('#pokeInput').val(); have it remove because i just have the html send in the data
    // to remove the qutation marks around the string so it properly get the pokemon
     var input = input.replace(/"/g,'')
     console.log(input);
    var url = 'https://pokeapi.co/api/v2/pokemon/' + input;
    var url2 = 'https://pokeapi.co/api/v2/pokemon-species/' + input

    $.get(url2, function (variety) {
        // Display information about the selected variety
        var forms = variety.varieties.map(function (varieties) {
            if (variety.varieties.length > 1) {
                console.log(`morethan1`);
                let formSelect = document.createElement('select');
                formSelect.name = "Form"
                formSelect.id = "varity"
                // need to have the orginal veneur in here so we can use the onchange function !!!!!!
                var countForm = 0
                let defaultOption = document.createElement('option')
                defaultOption.innerHTML = "Select A Form"
                defaultOption.value= ""
                formSelect.append(defaultOption)
                console.log(`setformselect`);
                for (varieties of variety.varieties) {
                    console.log(`into for loop`);
                    countForm++
                    if (varieties.is_default == false) {
                        let newOption = document.createElement('option')
                        let formName = JSON.stringify(varieties.pokemon.name)
                        newOption.innerHTML = formName
                        newOption.value = formName
                        let tempName = JSON.stringify(varieties.pokemon.name)
                        newOption.onchange = () => formUpdate(tempName)
                        formSelect.append(newOption)
                    }
                }
                document.getElementById('newerForms').innerHTML = "";
                document.getElementById('newerForms').append(formSelect)
            }
        }).join(', ');
    });


    $.getJSON(url, function (data) {
        var name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        var id = data.id;

        var types = data.types.map(function (type) {
            return type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        }).join(', ');
        var abilities = data.abilities.map(function (ability) {
            let hidden = '';
            if (ability.is_hidden == true) {
                hidden = " (HA)"
            }
            return `${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)} ${hidden}`
        }).join(', ');
        var height = data.height;
        var weight = data.weight;
        var imgSrc = data.sprites.other['official-artwork'].front_default;
        var imgSrcShiny = data.sprites.other['official-artwork'].front_shiny;

        // The code block below will sort the moves based on it learn level, and learn method. least to greatest learn level > TM > tutor > Egg
        var movesData = data.moves.sort(function MachineEggsort(a, b) {
            let am = a.version_group_details[a.version_group_details.length - 1].move_learn_method.name
            let bm = b.version_group_details[b.version_group_details.length - 1].move_learn_method.name
            switch (am) {
                case "level-up":
                    if (bm == "level-up") {
                        console.log(a.version_group_details[a.version_group_details.length - 1].level_learned_at);
                        return a.version_group_details[a.version_group_details.length - 1].level_learned_at - b.version_group_details[b.version_group_details.length - 1].level_learned_at
                    } else {
                        return -1
                    }
                    break;
                case "egg":
                    return 1
                    break;
                case "machine":
                    if (bm == "tutor" || bm == "egg") {
                        return -1
                    } else if (bm == "level-up") {
                        return 1
                    } else {
                        return 0
                    }
                    break;
                default:
                    if (bm == "machine" || bm == "level-up") {
                        return 1
                    } else if (bm == "egg") {
                        return -1
                    } else {
                        return 0
                    }
                    break;
            }
        })

        var bst = []
        var bsTotal = 0 

        var moves = movesData
            .filter(move => move.move && move.move.name)
            .map(move => {
                //For every move it goes through and grabs the last version and shows the latest info on that move for the selected pokemon
                let versionDetails = move.version_group_details[move.version_group_details.length - 1];
                let level = versionDetails ? `(${versionDetails.level_learned_at})` : '';
                let method = '';
                //The Following Code looks for moves learned via machine egg or tutor is will set the method learned to TMm, Egg, or Tutor.
                if (versionDetails && versionDetails.move_learn_method.name === 'machine') {
                    method = ' (TM)';
                } else if (versionDetails && versionDetails.move_learn_method.name === 'egg') {
                    method = ' (Egg)';
                } else if (versionDetails && versionDetails.move_learn_method.name === 'tutor') {
                    method = ' (Tutor)';
                }
                // Takes moves that have the method Tutor, TM, or Egg and removes the level
                if (level === '(0)' && (method === ' (Tutor)' || method === ' (TM)' || method === ' (Egg)')) {
                    level = '';
                }
                return `${move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)} ${level}${method}`;
            }).join(', ');
        var stats = data.stats.map(function (stats) {
            //made the information into a string than send it off to the page
            let stat = `${stats.stat.name.charAt(0).toUpperCase() + stats.stat.name.slice(1)} = ${stats.base_stat}`
            //stat[stats.stat.name] = stats.base_stat;
            // console.log(stat);
            bst.push(stats.base_stat)
            return stat
        }).join(', ');
        for (let i = 0; i < bst.length; i++) {
            bsTotal += bst[i]
        }

        // ot act like a onchange function for the select but however it can not choose the other pokemon that already selected.
        $('#varity').change(function() {
            getDetails($('#varity option:selected').text())
          });


        document.getElementById("bst").innerHTML = bsTotal

        $('#name').text(name);
        $('#id').text(id);
        $('#types').text(types);
        $('#abilities').text(abilities);
        $('#height').text(height);
        $('#weight').text(weight);
        $('#moves').text(moves);
        $('#stats').text(stats);
        $('#img').attr('src', imgSrc);
        $('#imgShiny').attr('src', imgSrcShiny);
        $('#error').hide();
        $('#pokeData').show();
    }).fail(function () {
        $('#pokeData').hide();
        $('#error').show();
    });
}
