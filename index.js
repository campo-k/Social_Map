var URL;
var GEO;
var GEOCHECK = false;

$(document).ready(function () {
    URL = window.URL || window.webkitURL;
    GEO = {lat: 35.824411, lng: 127.147990};

    var $gi = $("#machine-geo span:eq(1)");
    var $mi = $("#machine-info span:eq(1)").text(navigator.userAgent);

    // if (navigator.userAgent.indexOf('Mobile') == -1) {
    //     $("body").empty().append('<div class="no-mobile">모바일 환경에서 실행하여 주십시오.</div>');
    //
    //     return;
    // }

    if (!navigator.geolocation) {
        $mi.text('기기 미지원');
    }
    else {
        navigator.geolocation.watchPosition(geoSuccess, geoError);
    }
});

$(document).on("touchstart", ".ui-nav-sub li", function () {
    var $this = $(this);

    if($this.hasClass("active")) return;

    $(".ui-nav-sub li").removeAttr("class");
    $this.addClass("active");
});

$(document).on("touchstart", "#btn_nav", function (e) {
    e.preventDefault();

    var $this = $(this);
    var $plate = $("ul.ui-nav-sub");

    if ($this.hasClass('fa-rotate-90')) {
        $plate.slideUp();
        $this.removeAttr('style').removeClass('fa-rotate-90');
    }
    else {
        $plate.slideDown();
        $this.css('margin-top', '-22px').css('margin-right', '-20px').addClass('fa-rotate-90');
    }
});

$(document).on("click", "#btn_photo", function () {
    $("#storage").trigger("click");
});

$(document).on("change", "#storage", function (e) {
    var $img = $("#img_photo");
    var $geo = $(".ui-container-geo");
    var $con = $(".ui-container-photo");
    var $com = $('.ui-container-comment input')

    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function(){
        var jpeg = new JpegMeta.JpegFile(atob(this.result.replace(/^.*?,/,'')), e.target.files[0]);

        if(jpeg.gps) {
            $("#machine-geo span:eq(1)").text('사진 정보 사용');
            GEO = {lat: jpeg.gps.latitude, lng: jpeg.gps.longitude};
        }
        else {

        }
        $con.css('display', 'block');
        $geo.css('display', 'block');
        $geo.find('#map').css('height', $geo.find('#map').width());
        $img.attr('src', URL.createObjectURL(e.target.files[0]));

        var map = new google.maps.Map(document.getElementById('map'), {
            center: GEO,
            zoom: 18
        });
        var infowindow = new google.maps.InfoWindow({
            content: $com.text()
        });

        if(GEOCHECK) {
            var marker = new google.maps.Marker({
                position: GEO,
                title: "test",
                content: "1111",
            });

            marker.setMap(map);

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            })
        }
    };
});

function geoSuccess(position) {
    $("#machine-geo span:eq(1)").text(position.coords.latitude + ", " + position.coords.longitude);
    GEO = {lat: position.coords.latitude, lng: position.coords.longitude};
    GEOCHECK = true;
}

function geoError(error) {
    $("#machine-geo span:eq(1)").text('정보 미지원');
}