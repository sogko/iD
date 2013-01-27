iD.modes.AddArea = function() {
    var mode = {
        id: 'add-area',
        button: 'area',
        title: 'Area',
        description: 'Add parks, buildings, lakes, or other areas to the map.'
    };

    var behavior,
        defaultTags = {area: 'yes'};

    mode.enter = function() {
        var map = mode.map,
            history = mode.history,
            controller = mode.controller;

        function startFromNode(node) {
            var way = iD.Way({tags: defaultTags});

            history.perform(
                iD.actions.AddWay(way),
                iD.actions.AddWayNode(way.id, node.id),
                iD.actions.AddWayNode(way.id, node.id));

            controller.enter(iD.modes.DrawArea(way.id));
        }

        function startFromWay(other, loc, index) {
            var node = iD.Node({loc: loc}),
                way = iD.Way({tags: defaultTags});

            history.perform(
                iD.actions.AddNode(node),
                iD.actions.AddWay(way),
                iD.actions.AddWayNode(way.id, node.id),
                iD.actions.AddWayNode(way.id, node.id),
                iD.actions.AddWayNode(other.id, node.id, index));

            controller.enter(iD.modes.DrawArea(way.id));
        }

        function start(loc) {
            var node = iD.Node({loc: loc}),
                way = iD.Way({tags: defaultTags});

            history.perform(
                iD.actions.AddNode(node),
                iD.actions.AddWay(way),
                iD.actions.AddWayNode(way.id, node.id),
                iD.actions.AddWayNode(way.id, node.id));

            controller.enter(iD.modes.DrawArea(way.id));
        }

        behavior = iD.behavior.AddWay(mode)
            .on('startFromNode', startFromNode)
            .on('startFromWay', startFromWay)
            .on('start', start);

        mode.map.surface.call(behavior);
        mode.map.tail('Click on the map to start drawing an area, like a park, lake, or building.', true);
    };

    mode.exit = function() {
        mode.map.surface.call(behavior.off);
    };

    return mode;
};