var client = new XMLHttpRequest();
client.onreadystatechange = xmlHandler;
client.open("GET", "/images/sprite/sheet.xml");
client.send();

function xmlHandler() {
	if (this.readyState == 4) {
		if (this.status == 200 || this.status === 0) {
			if (this.responseXML !== null) {
				var x = this.responseXML.getElementsByTagName("image");
				if (x === null ) return;

				for (var n = 0; n < x.length; n++) {
					var atlasImage = new AtlasImage();
					atlasImage.load(x[n]);
					atlasMap[x[n].getAttribute("name")] = atlasImage;
				}

				init2();
			}
			else {
				alert("this.responseXML == null");
			}
		}
		else {
			alert("this.status = " + this.status);
		}
	}
}

function AtlasImage()
{
	this.m_x;
	this.m_y;
	this.m_width;
	this.m_height;
	this.m_xOffset;
	this.m_yOffset;
	this.load = function(elem) {
		this.m_x = parseInt(elem.getAttribute("x")); 
		this.m_y = parseInt(elem.getAttribute("y")); 
		this.m_width = parseInt(elem.getAttribute("width"));
		this.m_height = parseInt(elem.getAttribute("height"));
		// offset is an optional parameter
		if (elem.getAttribute("xOffset"))
			this.m_xOffset = parseInt(elem.getAttribute("xOffset"));
		else
			this.m_xOffset = 0;
		if (elem.getAttribute("yOffset"))
			this.m_yOffset = parseInt(elem.getAttribute("yOffset"));
		else
			this.m_yOffset = 0;
	}
	this.render = function(x, y) {
		context.drawImage(atlas, this.m_x, this.m_y,
		this.m_width, this.m_height, 
		this.m_xOffset+x, this.m_yOffset+y, 
		this.m_width, this.m_height);  
	}
}