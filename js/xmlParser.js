function loadAssets(url) {
	var client = new XMLHttpRequest();
	client.onreadystatechange = function(){
		if (this.readyState == 4) {
			if (this.status == 200 || this.status === 0) {
				if (this.responseXML !== null) {
					var x = this.responseXML.getElementsByTagName("SubTexture");
					if (x === null ) return;

					var imgMap = {};

					for (var n = 0; n < x.length; n++) {
						var atlasImage = new AtlasImage();
						atlasImage.load(x[n]);
						imgMap[x[n].getAttribute("name")] = atlasImage;
					}

					localStorage.setItem('imageMap', JSON.stringify(imgMap));
				}
				else {
					alert("this.responseXML == null");
				}
			}
			else {
				alert("this.status = " + this.status);
			}
		}
	};
	client.open("GET", url);
	client.send();
}

function AtlasImage() {
	this.m_x;
	this.m_y;
	this.m_width;
	this.m_height;
	this.m_xOffset;
	this.m_yOffset;

	this.load = function(elem) {
		this.m_x = parseInt(elem.m_x); 
		this.m_y = parseInt(elem.m_y); 
		this.m_width = parseInt(elem.m_width);
		this.m_height = parseInt(elem.m_height);
		// offset is an optional parameter
		if (elem.m_xOffset)
			this.m_xOffset = parseInt(elem.m_xOffset);
		else
			this.m_xOffset = 0;
		if (elem.m_xOffset)
			this.m_yOffset = parseInt(elem.m_yOffset);
		else
			this.m_yOffset = 0;
	};

	this.render = function(src, x, y) {
		ctx.drawImage(src, this.m_x, this.m_y,
		this.m_width, this.m_height,
		this.m_xOffset+x, this.m_yOffset+y,
		this.m_width, this.m_height);
	};
}