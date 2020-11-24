
/*#######  Инициализация ########################### */




$(function(){


   var it_vision={
      config:{
      	itVisionColor:'it-vision-color-1'
      },
      
      init:function(){
         it_vision.load_config();
         it_vision.dom();
         it_vision.events();
         it_vision.apply_config();
         it_vision.player.init();
      },

      dom:function(){
      	var control;

         $('[role=it-right-navbar]').append('<li title="Версия для слабовидящих"><a role="it-vision-toggle" ><i class="fa fa-eye-slash" aria-hidden="true"></i></a></li>');
         $('.topnav .navbar-header').append('<button type="button" class="navbar-toggle" role="it-vision-toggle"  ><i class="fa fa-eye-slash" aria-hidden="true"></i></button>');	

         var panel_outer=$("<div class='it-vision-panel' />");
         var panel_outer_1=$("<div class='_inner_container container-fluid' />");
         var panel=$("<div class='_inner' />");

         brand=$("<div class='_brand' role='it-vision-toggle' />");
         brand.append("<i class='fa fa-eye-slash' />");  
         panel.append(brand); 
 
         control=$("<div class='_control_group _control_group_color' role='itv_selector_group' data-name='itVisionColor' />");
         control.append("<div class='_control_title'>Цвет:</div>");
         control.append("<div role='itv_selector' data-value='it-vision-color-1' class='_control' >1</div>");
         control.append("<div role='itv_selector' data-value='it-vision-color-2' class='_control' >2</div>");
         control.append("<div role='itv_selector' data-value='it-vision-color-3' class='_control' >3</div>");
         control.append("<div role='itv_selector' data-value='it-vision-color-4' class='_control' >4</div>");
         control.append("<div role='itv_selector' data-value='it-vision-color-5' class='_control' >5</div>");         
         panel.append(control); 
 
			control=$("<div class='_control_group _control_group_font_family' role='itv_selector_group' data-name='itVisionFontFamily' />");
         control.append("<div class='_control_title'>Шрифт:</div>");
         control.append("<div role='itv_selector' data-value='it-vision-font-family-1' class='_control' >A</div>");
         control.append("<div role='itv_selector' data-value='it-vision-font-family-2' class='_control' >A</div>");
         panel.append(control); 
         
			control=$("<div class='_control_group _control_group_font_size' role='itv_selector_group' data-name='itVisionFontSize' />");
         control.append("<div class='_control_title'>Размер:</div>");
         control.append("<div role='itv_selector' data-value='it-vision-font-size-1' class='_control' >A</div>");
         control.append("<div role='itv_selector' data-value='it-vision-font-size-2' class='_control' >A</div>");
         control.append("<div role='itv_selector' data-value='it-vision-font-size-3' class='_control' >A</div>");
         panel.append(control); 
         
			control=$("<div class='_control_group _control_group_images' role='itv_selector_group' data-name='itVisionImages' />");
         control.append("<div class='_control_title'>Изображения:</div>");
         control.append("<div role='itv_selector' data-value='it-vision-images-on' title='Включить изображения' class='_control' ><i class='fa fa-toggle-off'></i></div>");
         control.append("<div role='itv_selector' data-value='it-vision-images-off' title='Отключить изображения' class='_control' ><i class='fa fa-toggle-on'></i></div>");
         panel.append(control); 
 
         panel_outer_1.append(panel); 
         panel_outer.append(panel_outer_1); 
         
         $('body').prepend(panel_outer);         
      },
      
      load_config:function(){     
         if (localStorage.getItem('it_vision_v04')){
            try {
               it_vision.config=JSON.parse(localStorage.getItem('it_vision_v04'));
            } catch (e) {
             
            }
         } 
         console.log(it_vision.config);
      },
      
      save_config:function(){
         localStorage.setItem('it_vision_v04',  JSON.stringify(it_vision.config));     
      },      
      
      apply_config:function(){
         var body_data=$('html').data('it_vision');
         body_data=body_data?body_data:{};
      
      	for (var key in it_vision.config){
         	var value=it_vision.config[key];
            
            if (
            	key=='itVisionColor' 
            	|| key=='itVisionFontFamily' 
            	|| key=='itVisionFontSize' 
            	|| key=='itVisionImages' 
            	|| key=='itVisionVolume' 
            ){
            	$("[data-name='"+key+"'] *").removeClass("active");
            	$("[data-name='"+key+"'] [data-value='"+value+"']").addClass("active");
               
               $('html').removeClass(body_data[key]).addClass(value);
               body_data[key]=value;
            }
            
            if (key=='panel_opened'){               
            	 if (value){
                   $('html').addClass('spbitec_vision_panel_opened').addClass('it-vision');
                   $(document).trigger('on_it_vision_open');
                }else{
                   $('html').removeClass('spbitec_vision_panel_opened').removeClass('it-vision');
                    $(document).trigger('on_it_vision_close');
                }
            
            } 
         }
         
         $('html').data('it_vision',body_data);
      },
      
      events:function(){
      
     	 /*#######  Селекторы ########################### */
         $(document).on('click','[role="itv_selector"]',function(){ 
            var $param=$(this).closest('[role="itv_selector_group"]');
            var name=$param.data('name');
            it_vision.config[name]=$(this).data('value');                 
            it_vision.apply_config();
            it_vision.save_config();
         });
         
         /*#######  Переключатель ########################### */
         $(document).on('click','[role="it-vision-toggle"]',function(){ 
            if (it_vision.config['panel_opened']){
               it_vision.config['panel_opened']=false;
            }else{
               it_vision.config['panel_opened']=true;
            }            
            it_vision.apply_config();
            it_vision.save_config();
         })        
         
      },

      player:{
      	object:null, 
      	button:null, 
      	$source:null, 
         
         init:function(){
         	var audio = new Audio();
				var canPlayMmp3 = !!audio.canPlayType && audio.canPlayType('audio/mp3') != "";
            
            $('[data-tts]').each(function(){
            	var t=$(this).text().trim();               
               
               if (t.length>1 && canPlayMmp3){
               	$(this).attr('data-tts','on').attr('title','Прослушать');
                  
               }else{
               	$(this).attr('data-tts','off');
               }              
            })    
            
            /*#######  Переключатель ########################### */
            $(document).on('click','html.it-vision [data-tts]',function(){
               if ($(this).attr('data-tts-state')=='playing'){
               	$(this).attr('data-tts-state','ended'); 
						it_vision.player.stop();
               }else{
                  var t=$(this).text().trim();   

                  if($('[name="itconfig-tts-url"]').size()){                  
                     var url=$('[name="itconfig-tts-url"]').attr('content');
                     if(url){
                     	it_vision.player.load(url+encodeURIComponent(t),this);
                     }
                  }

                  $(this).attr('data-tts-state','loading');          
               }
            })            
         },
                  
         load:function(url,button){
         	var player=it_vision.player;     
            
            player.stop();
            if (player.button){
            	 $(player.button).removeAttr('data-tts-state');
            }
            player.button=button;
            
            if (player.object) delete  player.object;            
            player.object=new Audio();        

            $(player.object).on('playing', function() {
               $(player.button).attr('data-tts-state','playing'); 
            })
           
           $(player.object).on('ended', function(d,n) {     
              $(player.button).attr('data-tts-state','ended'); 
            })
           
            player.object.src = url;         
         	player.play();
            
            return player;
         },
         stop:function(){
         	if (it_vision.player.object) it_vision.player.object.pause();
            return it_vision.player;
         },
         play:function(){
         	if (it_vision.player.object) it_vision.player.object.play();
            return it_vision.player;
         }
      }

   }

   it_vision.init();
   $('html').addClass('it-vision-installed');
});


 

 





function itTTS(source,volume,loop){
   this.source=source;
   this.volume=volume;
   this.loop=loop;
   var son;
   this.son=son;
   this.finish=false;
   this.$obj=false;

   this.removeAll=function(){
      $('.itTTS').remove();
      return this;
   }   
   this.stop=function(){
      if (this.$obj) this.$obj.remove();      
      return this;
   }

   this.start=function(){
      if(this.finish)return false;
      var audiotag=$('<audio autoplay/>');
      audiotag.attr("hidden","true");
      audiotag.attr("volume","true");
      audiotag.addClass("itTTS");      
      var source=$('<source src="'+this.source+'" type="audio/mpeg" />');
      audiotag.append(source);      
      this.obj=audiotag;
      $('body').append(audiotag);      

      audiotag.on('loadeddata',function(){
         // alert('loadeddata!!!');
      });

      return this;
   }

   this.remove=function(){
      if (this.$obj) this.$obj.remove();
      this.finish=true;
      return this;
   }

   this.init=function(volume,loop){
      this.finish=false;
      this.volume=volume;
      this.loop=loop;
      return this;
   }
}

