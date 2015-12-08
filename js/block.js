var BLOCK_ASSET_ROW_NUM = 1;
var BLOCK_ASSET_COL_NUM = 2;
var BLOCK_ASSET_GAP = 0.5;
function Block(position) {
    this.assets = [];
    this.plane = new Road({x:position.x, z:position.z}, Block.getWidth(), Block.getDepth());
    var ASSET_WIDTH = Asset.getWidth();
    var ASSET_DEPTH = Asset.getDepth();
    position.x -= Block.getWidth()/2;
    position.z -= Block.getDepth()/2;
    for (var i=0; i<BLOCK_ASSET_ROW_NUM; i++) {
        for (var j=0; j<BLOCK_ASSET_COL_NUM; j++) {
            var position_x = i * (ASSET_WIDTH+BLOCK_ASSET_GAP) + position.x + ASSET_WIDTH/2;
            var position_z = j * (ASSET_DEPTH+BLOCK_ASSET_GAP) + position.z + ASSET_DEPTH/2;
            var position_y = position.y;
            var asset = Asset.type('cube').position({x:position_x, z:position_z, y:position_y});
            this.assets.push(asset);
        }
    }
}
Block.prototype.draw = function(scene) {
    this.plane.draw(scene);
    for (var i=0; i<this.assets.length; i++)
        this.assets[i].draw(scene);
};
Block.getWidth = function(){return BLOCK_ASSET_ROW_NUM*Asset.getWidth();};
Block.getDepth = function(){return BLOCK_ASSET_COL_NUM*Asset.getDepth()+(BLOCK_ASSET_COL_NUM-1)*BLOCK_ASSET_GAP;};
