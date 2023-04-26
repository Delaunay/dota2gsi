

var namespace = "npc_dota_hero_"

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

    update(char) {
        function has_values(obj) {
            return Object.keys(obj).length !== 0
        }
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

                if (obj.name === 'plus_high_five' || obj.name === 'plus_guild_banner') {
                    ignore = true;
                }
            
                if (!ignore && has_values(obj)) {
                    // var n = obj.name.substring(this.name.length + 1)
                    var n = obj.name.replace(/\_/gi, '-')
                    ability.src = "/static/abilities/" + n + ".webp";

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

        if (Object.keys(char.player).length !== 0) {
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
            dire[i].update(gamestate.dire[i]);
        } catch (err) {
            console.log(err);
        }
    }
    for(var i = 0; i < 5; i++) {
        try {
            radiant[i].update(gamestate.radiant[i]);
        } catch (err) {
            console.log(err);
        }
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
