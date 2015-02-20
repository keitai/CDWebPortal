var SmallDB=(function(){
	var tableRefs={};
	(function(){
		var rawData=localStorage.getItem("SmallDBInfo");
		if(rawData!==null){
			var data=JSON.parse(rawData);
			data.forEach(function(tableName){
				tableRefs[tableName]=JSON.parse(localStorage[tableName+":info"]);
			});
		}
	})();
	
	function SmallDBTable(name,info){
		var self = {
			select:function(selector){
				if(info.active===false) return [];
				var results=[];
				info.ids.forEach(function(id){
					var entry=JSON.parse(localStorage[name+":entry:"+id]);
					if(selector(entry)===true)
						results.push(entry);
				});
				return results;
			},
			insert:function(data){
				if(info.active===false) return null;
				data.ID=info.next++;
				info.ids.push(data.ID);
				localStorage[name+":info"]=JSON.stringify(info);
				localStorage[name+":entry:"+data.ID]=JSON.stringify(data);
				return data;
			},
			update:function(id,data){
				if(info.active===false) return null;
				if(info.ids.indexOf(id)===-1)
					return null;
				var base=JSON.parse(localStorage[name+":entry:"+id]);
				Object.keys(data).forEach(function(key){
					base[key]=data[key];
				});
				base.ID=id;
				localStorage[name+":entry:"+id]=JSON.stringify(base);
				return base;
			},
			overwrite:function(id,data){
				if(info.active===false || info.ids.indexOf(id)===-1) return false;
				data.ID=id;
				localStorage[name+":entry:"+id]=JSON.stringify(data);
				return true;
			},
			remove:function(selector){
				if(info.active===false) return null;
				var newIDs=[], removedIDs=[];
				info.ids.forEach(function(id){
					var entry=JSON.parse(localStorage[name+":entry:"+id]);
					if(selector(entry)===true)
						removedIDs.push(entry);
					else
						newIDs.push(id);
				});
				info.ids=newIDs;
				removedIDs.forEach(function(entry){
					localStorage.removeItem(name+":entry:"+entry.ID);
				});
				localStorage[name+":info"]=JSON.stringify(info);
				localStorage.SmallDBInfo=JSON.stringify(info);
				return removedIDs;
			}
		};
		return self;
	}
	
	function loadTable(name,create){
		var tableData=null;
		if(!tableRefs.hasOwnProperty(name) && create===true){
			tableData={ids:[],next:0,active:true};
			tableRefs[name]=tableData;
			localStorage["SmallDBInfo"]=JSON.stringify(Object.keys(tableRefs));
			localStorage[name+":info"]=JSON.stringify(tableData);
		}
		else
			tableData=tableRefs[name];
		if(tableData!==null)
			return SmallDBTable(
				name,
				tableData
			);
		return null;
	}
	function deleteTable(name){
		if(!tableRefs.hasOwnProperty(name)) return false;
		tableRefs[name].active=false;
		tableRefs[name].ids.forEach(function(id){
			localStorage.removeItem(name+":entry:"+id);
		});
		localStorage.removeItem(name+":info");
		
		delete tableRefs[name];
		localStorage.SmallDBInfo=JSON.stringify(Object.keys(tableRefs));
		
		return true;
	}
	
	return {
		loadTable:loadTable,
		deleteTable:deleteTable,
		where1:function(){return true}
	};
})();
function clearLocalStorage(){
	Object.keys(localStorage).forEach(function(key){
		localStorage.removeItem(key);
	});
}
function getLocalStorageUsage(){
	var bytes = 0;
	Object.keys( localStorage ).
	forEach( function( key ){
		bytes += key.length;
		bytes += localStorage[key].length;
	} );
	return bytes;
}
