# F:\SteamLibrary\steamapps\common\dota 2 beta
# F:\SteamLibrary\steamapps\common\dota 2 beta\game\dota\cfg\gamestate_integration

from dataclasses import asdict
import hashlib

from flask import Flask
from flask import request
from flask import render_template

from dota2gsi.core.messages import WorldState, Character

app = Flask(__name__)
unique = set()
worldstate = WorldState()
save_replay = False
test_state = False

def reset():
    global unique, worldstate
    unique = set()
    worldstate = WorldState()


@app.route("/api/gamestate", methods = ['GET'])
def get_dota2state():
    """Returns the dota2state for rendering"""
    if test_state:
        print('Loading test state')
        import json

        with open('replay.txt', 'r') as f:
            messages = f.read().split(';')

        for msg in messages:
            if msg != '':
                update_worldstate(json.loads(msg))

    return asdict(worldstate)

@app.route("/api/template/hero", methods = ['GET'])
def hero_template():
    return render_template('hero.html', title='index')

@app.route("/api/draft", methods = ['GET'])
def draft():
    """Extract the drafting information"""
    draft = dict(
        radiant=[-1, -1, -1, -1, -1], 
        dire=[-1, -1, -1, -1, -1]
    )

    for i, char in enumerate(worldstate.radiant):
        draft['radiant'][i] = char['hero'].get('id', -1)

    for i, char in enumerate(worldstate.dire):
        draft['dire'][i] = char['hero'].get('id', -1)

    # Configure OpenDota API to make draft suggestions
    return draft
    

def update_worldstate(data):
    if False:
        print('New match')
        reset()
        worldstate.provider.update(data['provider'])

    map = data.get('map', {})
    worldstate.map.update(map)

    # Update player info
    player = data.get('player', {})
    team = player.get('team_slot')
    slot = player.get('player_slot')

    if team is not None and slot is not None:
        character: Character = worldstate.character(team, slot)
        character['player'].update(player)

        # character['dir'].append()

        hero = data.get('hero', {})
        character['hero'].update(hero)

        abilities = data.get('abilities', [])
        for k, ability in abilities.items():
            character['abilities'][k].update(ability)
        
        items = data.get('items', dict())
        for k, item in items.items():
            character['items'][k].update(item)
        
    

@app.route("/api/gamestate", methods = ['POST'])
def update_dota2state():
    """Accumulate updates into a single WorldState that we can render"""
    sha = hashlib.md5()
    sha.update(request.data)
    sha = sha.hexdigest()

    if sha in unique:
        return ('', 204)
    unique.add(sha)

    # print(request.data.decode('utf-8'))
    data = request.json
    # print(data)
    if save_replay:
        with open('replay.txt', 'ab') as f:
            f.write(b';')
            f.write(request.data)

    update_worldstate(data)

    return ('', 204)
    # --


@app.route("/")
def index():
    return render_template('index.html', title='index')
