

var namespace = "npc_dota_hero_"

var kda = document.getElementById("kda");
var ld = document.getElementById("ld");
var nw = document.getElementById("nw");
var xpm = document.getElementById("xpm");
var gpm = document.getElementById("gpm");

var day = document.getElementById("day");
var siege = document.getElementById("siege");
var power = document.getElementById("power");
var water = document.getElementById("water");
var bounty = document.getElementById("bounty");
var wisdom = document.getElementById("wisdom");
var tormentors = document.getElementById("tormentors");
var stack = document.getElementById("stack");
var slp = document.getElementById("slp");
var oflp = document.getElementById("oflp");
var roshan = document.getElementById("roshan");

function has_values(obj) {
    return Object.keys(obj).length !== 0
}


class Character {
    constructor(id) {
        this.id = id
        this.item = document.getElementById(id);
        this.name = null;
    }

    set_html(template) {
        var specialized = template.replace(/\$id/gi, this.id)
        this.item.innerHTML = specialized

        // 
        // 
    }

    update(map, char) {
        if (has_values(char.hero)) {
            this.portrait = document.getElementById("portrait-" + this.id);

            if (this.name == null && char.hero.hasOwnProperty('name')) {
                this.name = char.hero.name.substring(namespace.length)
                
                this.portrait.src = "/static/heroes/" + this.name + "_sb.png";
            }

            var health = document.getElementById("health-txt-" + this.id);
            health.innerHTML = char.hero.health + "/" + char.hero.max_health;
            
            health = document.getElementById("health-" + this.id);
            health.style.width = char.hero.health_percent  + "%";

            var mana = document.getElementById("mana-txt-" + this.id);
            mana.innerHTML = char.hero.mana + "/" + char.hero.max_mana;
            
            mana = document.getElementById("mana-" + this.id);
            mana.style.width = char.hero.mana_percent + "%";

            if (char.hero.alive) {
                this.portrait.style.filter = null;
            } else {
                this.portrait.style.filter = 'grayscale(100%)';
            }

            if (typeof char.hero.xpos === 'number') {
                var xmin = -8750;
                var ymin = -8550;
                var xrange = 18000;
                var yrange = 18000;

                var x = (char.hero.xpos - xmin) / xrange * 512;
                var y = (1 - (char.hero.ypos - ymin) / yrange) * 512;
                var loc = document.getElementById("loc-" + this.id);

                loc.setAttribute("transform", "translate(" + x + "," + y + ")");
            }
        }

        if (has_values(char.items)) {
            for (const prop in char.items) {
                var item = document.getElementById(prop + "-" + this.id);
                var obj = char.items[prop];
                
                if (has_values(obj) && obj.name !== 'empty') {
                
                    if (item !== null) { 
                        item.src = "/static/items/" + obj.name.substring(5) + "_lg.png";
                    }
                    if (obj.can_cast) {
                        item.style.filter = null;
                    } else {
                        item.style.filter = 'grayscale(100%)';
                    }
                } else if (item !== null) {
                    item.src = "/static/items/empty.png";
                }
            }
        }
       
        if (has_values(char.abilities)) {
            for (const prop in char.abilities) {

                var ability = document.getElementById(prop + "-" + this.id);
                var obj = char.abilities[prop];
                var ignore = false;

                if (obj.name === 'plus_high_five' || obj.name === 'plus_guild_banner' || !has_values(obj)) {
                    ignore = true;
                    console.log('Ingore ' + prop)
                }
                if (!ignore) {
                    // var n = obj.name.substring(this.name.length + 1)
                    var n = obj.name.replace(/\_/gi, '-')
                    ability.src = "/static/abilities/" + n + ".webp";
                    ability.style.display = 'inline-block';
                    if (obj.can_cast) {
                        ability.style.filter = null;
                    } else {
                        ability.style.filter = 'grayscale(100%)';
                    }
                } else {
                    ability.style.display = 'none';
                    ability.src = "/static/items/empty.png";
                }
            }
        }

        if (has_values(char.player)) {
            kda.innerHTML = char.player.kills + ' / ' + char.player.deaths + ' / ' + char.player.assists;
            ld.innerHTML = char.player.last_hits + ' / ' + char.player.denies ;
            // var val = char.player.gold_reliable + char.player.gold_unreliable;
            // var val2 = char.player.gold_from_creep_kills + char.player.gold_from_hero_kills + char.player.gold_from_income + char.player.gold_from_shared;
            nw.innerHTML =  (char.player.gpm * Math.max(map.clock_time, 1) / 60 + 600).toFixed(0);

            //    + ' / ' + val + ' / ' + val2 + ' / ' + char.player.gold
            //    ;
            gpm.innerHTML = char.player.gpm;
            xpm.innerHTML = char.player.xpm;
        }
    }
};

radiant = [
    new Character("t0-s0"),
    new Character("t0-s1"),
    new Character("t0-s2"),
    new Character("t0-s3"),
    new Character("t0-s4"),
]

dire = [
    new Character("t1-s0"),
    new Character("t1-s1"),
    new Character("t1-s2"),
    new Character("t1-s3"),
    new Character("t1-s4"),
]

players = [radiant, dire]


function update_state(gamestate) {
    for(var i = 0; i < 5; i++) {
        try {
            dire[i].update(gamestate.map, gamestate.dire[i]);
        } catch (err) {
            console.log(err);
        }
    }
    for(var i = 0; i < 5; i++) {
        try {
            radiant[i].update(gamestate.map, gamestate.radiant[i]);
        } catch (err) {
            console.log(err);
        }
    }

    update_map(gamestate.map)
}

function update_map(map) {
    function rune_time(min) {
        return min * 60 - map.clock_time % (min * 60)
    }
    if (has_values(map)) {
        var minutes = map.clock_time / 60;

        var is_day = Math.trunc(minutes / 5) % 2 == 0 && map.clock_time > 0;
        var seconds = map.clock_time % 60;

        day.innerHTML        = is_day + " | " + ((map.clock_time % (5 * 60)) / (5 * 60) * 100).toFixed(0) + " %";
        siege.innerHTML      = rune_time(5);
        power.innerHTML      = minutes > 6 ? rune_time(2) : rune_time(6); // Spawn after 6, respawns every 2 minutes
        bounty.innerHTML     = rune_time(3);                              // Spawns every 3 minutes
        wisdom.innerHTML     = rune_time(7) ;                              // Spawns every 7 minutes
        tormentors.innerHTML = minutes > 20 ? rune_time(10): rune_time(20);
        stack.innerHTML      = minutes > 0 ? Math.max(55 - seconds, 0): -1;
        water.innerHTML      = minutes > 6.5 ? -1 : rune_time(2);
        roshan.innerHTML     = is_day ? "Rad/Bot": "Dire/Top";
        slp.innerHTML        = Math.min(17 + 60 - map.clock_time % (17 + 60), Math.max(48 - seconds, 0));
        oflp .innerHTML      = Math.min(17 + 60 - map.clock_time % (17 + 60), Math.max(48 - seconds, 0));
    }
}

function request_update() {
    const req = new XMLHttpRequest();
    req.responseType = 'json';
    req.onload = function() {
        update_state(req.response)
    }
    req.open("GET", "/api/gamestate");
    req.send();
}

function populate_heroes_from_template() {
    populate = function () {
        template = this.responseText;
        
        for (var t = 0; t < 2; t++) {
            for (var i = 0; i < 5; i++) {
                player = players[t][i];
                player.set_html(template);
            }
        }

        // Request the game state to update the current state
        const req = new XMLHttpRequest();
        req.responseType = 'json';
        req.onload = function() {
            update_state(req.response)

            // Fixme: use websocket to get update directly from the server
            setInterval(
                request_update,
                500,
            );
        }
        req.open("GET", "/api/gamestate");
        req.send();
    }

    // Prepare the hero views from the template
    const req = new XMLHttpRequest();
    req.addEventListener("load", populate);
    req.open("GET", "/api/template/hero");
    req.send();
}


populate_heroes_from_template()
