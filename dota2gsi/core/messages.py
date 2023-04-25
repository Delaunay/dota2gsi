from dataclasses import dataclass, field
from typing import Dict, List, Optional
from collections import defaultdict


@dataclass
class Provider:
    name: str = 'Dota 2'
    appid: int = 570
    version: int = 47
    timestamp: int = 0


@dataclass
class Map:
    name: str
    matchid: str
    gmae_time: int
    clock_time: int
    daytime: bool 
    nightstalker_night: False
    radiant_score: int
    dire_score: int
    game_state: str
    paused: bool
    win_team: str
    customgamename: str
    ward_purchase_cooldown: float


@dataclass
class Player:
    steamid: str
    accountid: str
    name: str
    activity: str
    kills: int
    deaths: int
    assists: int
    last_hits: int
    denies: int
    kill_streak: int
    commands_issued: int
    kill_list: dict
    team_name: str
    player_slot: int
    team_slot: int
    gold: int
    gold_reliable: int
    gold_unreliable: int
    gold_from_hero_kills: int
    gold_from_creep_kills: int
    gold_from_income: int
    gold_from_shared: int
    gpm: int
    xpm: int


@dataclass
class Hero:
    xpos: int
    ypos: int
    id: int
    name: str
    level: int
    xp: int
    alive: bool
    respawn_seconds: int
    buyback_cost: int
    buyback_cooldown: int
    health: int
    max_health: int
    health_percent: int
    mana: int
    max_mana: int
    mana_percent: int
    silenced: bool
    stunned: bool
    disarmed: bool
    magicimmune: bool
    hexed: bool
    muted: bool
    break_: bool
    aghanims_scepter: bool
    aghanims_shard: bool
    smoked: bool
    has_debuff: bool
    talent_1: bool
    talent_2: bool
    talent_3: bool
    talent_4: bool
    talent_5: bool
    talent_6: bool
    talent_7: bool
    talent_8: bool
    attributes_level: int


@dataclass
class Ability:
    name: str
    level: int
    can_cast: bool
    passive: bool
    ability_active: bool
    cooldown: int
    ultimate: bool


@dataclass
class Item:
    name: str
    purchaser: int
    item_level: int
    can_cast: bool
    cooldown: float
    passive: bool
    charges: int


@dataclass
class GameState:
    provider: Provider = Provider()
    map: Map = field(default_factory=dict)
    player: Optional[Player] = None
    hero: Optional[Hero] = None
    abilities: Dict[str, Ability] = field(default_factory=dict)
    items: Dict[str, Item] = field(default_factory=dict)



defaultdictdict = lambda: defaultdict(dict)

@dataclass
class Character:
    player: Player = field(default_factory=dict)
    hero: Hero = field(default_factory=dict)
    abilities: Dict[str, Ability] = field(default_factory=defaultdictdict)
    items: Dict[str, Item] = field(default_factory=defaultdictdict)


def make_team():
    return [
        dict(player=dict(), 
             hero=dict(), 
             abilities=dict(
                ability0=dict(), 
                ability1=dict(), 
                ability2=dict(), 
                ability3=dict(), 
                ability4=dict(), 
                ability5=dict(),
                ability6=dict(),
             ), 
             items=dict(
                slot0=dict(), 
                slot1=dict(), 
                slot2=dict(), 
                slot3=dict(), 
                slot4=dict(), 
                slot5=dict(), 
                slot6=dict(), 
                slot7=dict(), 
                slot8=dict(), 
                stash0=dict(), 
                stash1=dict(), 
                stash2=dict(), 
                stash3=dict(), 
                stash4=dict(), 
                stash5=dict(), 
                teleport0=dict(), 
                neutral0=dict(), 
             ), 
             dir=[]
            ) 
            for _ in range(5)
        ]


@dataclass
class WorldState:
    provider: Provider = field(default_factory=dict)
    map: Map = field(default_factory=dict)
    radiant: List[Character] = field(default_factory=make_team)
    dire: List[Character] = field(default_factory=make_team)

    def character(self, team, slot):
        return [self.radiant, self.dire][team][slot]
