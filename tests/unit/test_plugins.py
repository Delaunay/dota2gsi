import  dota2gsi.plugins
from  dota2gsi.core import discover_plugins


def test_plugins():
    plugins = discover_plugins( dota2gsi.plugins)

    assert len(plugins) == 1
