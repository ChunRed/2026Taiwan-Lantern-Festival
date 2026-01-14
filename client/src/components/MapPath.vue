<script setup>
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { motion } from "motion-v"
    import gsap from "gsap";
    import { MotionPathPlugin } from "gsap/MotionPathPlugin";

    gsap.registerPlugin(MotionPathPlugin);


    onMounted(() => {
  
        gsap.to("#rect3", {
            
            duration: 12, 
            delay:2,

            repeat: 12,
            repeatDelay: 3,
            yoyo: true,
            ease: "power1.inOut",
            motionPath:{
                path: "#path3",
                align: "#path3",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
                },
            scale:100,
        });
        
        

        gsap.to("#rect1", {
            duration: 16, 
            delay:2,
            repeat: 12,
            repeatDelay: 5,
            yoyo: true,
            ease: "power1.inOut",
            motionPath:{
                path: "#path1",
                align: "#path1",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
                },
            scale:100,
        });
        gsap.to("#rect4", {
            duration: 14,
            delay:2, 
            repeat: 12,
            repeatDelay: 7,
            yoyo: true,
            ease: "power1.inOut",
            motionPath:{
                path: "#path4",
                align: "#path4",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
                },
            scale:100,
        });
        gsap.to("#rect2", {
            duration: 14, 
            delay:2,
            repeat: 12,
            repeatDelay: 1,
            yoyo: true,
            ease: "power1.inOut",
            motionPath:{
                path: "#path2",
                align: "#path2",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
                },
            scale:100,
        });
        gsap.to("#rect5", {
            duration: 12, 
            delay:2,
            repeat: 12,
            repeatDelay: 2,
            yoyo: true,
            ease: "power1.inOut",
            motionPath:{
                path: "#path5",
                align: "#path5",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
                },
            scale:100,
        });
    });

</script>

<template>
    <svg viewBox="0 0 450 600"  class="  absolute top-0 left-0 w-full h-full pointer-events-none">
            
        <motion.path
        id="path1"
        d="M310 521C365 546 417.881 529.3 425.5 482.5C429 461 425 430 397.5 413.5C366.482 394.889 307.591 398.212 270.5 385.5C216.455 366.977 185.5 345.5 179.5 342.5C173.5 339.5 171.133 340.514 171.5 345.5C174 379.5 234.67 486.759 310 521Z"
        stroke="#ffffff"
        stroke-width="1"
        fill="none"
        :initial="{ pathLength: 0 }"
        :animate="{ pathLength: 1 }"
        :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
        class="blur-[2px]"/>
        <g id="rect1">
		 <circle ref="dotEl" r=".1" fill="white" />
	</g>
    </svg>


    <svg viewBox="0 0 450 600"  class=" absolute top-0 left-0 w-full h-full pointer-events-none">
            
        <motion.path
        id="path2"
        class="blur-[3px]"
        d="M256.999 84.5001C250.897 99.3467 236.617 104.065 223.499 116C203.593 134.111 186.443 70.7973 221.416 54.5966C230.202 50.5266 243.5 50.2482 251.499 56C261.404 63.1214 260.149 76.8374 256.999 84.5001Z"
        stroke="#ffffff"
        stroke-width="2"
        fill="none"
        :initial="{ pathLength: 0 }"
        :animate="{ pathLength: 1 }"
        :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
        />
        <g id="rect2">
		 <circle ref="dotEl" r=".09" fill="white" />
	</g>
    </svg>


    <svg viewBox="0 0 450 600"  class=" absolute top-0 left-0 w-full h-full pointer-events-none">
            
        <motion.path
        class="blur-[5px]"
        id="path3"
        d="M414.159 213.112C379.718 154.685 322.5 124 285.576 114.932C262.876 109.357 237.5 114.932 241 157.5C244.146 195.767 219 204.616 197 219C176.352 232.5 164 255.5 170 287.5C180.5 331.5 242.5 358 281.5 368C320.5 378 369.5 383.806 414.159 350.5C445.142 327.394 448.6 271.538 414.159 213.112Z" 
        stroke="#ffffff"
        stroke-width="4"    
        fill="none"
        :initial="{ pathLength: 0 }"
        :animate="{ pathLength: 1 }"
        :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
        />
        <g id="rect3" class="circle3">
		 <circle ref="dotEl" r=".1" fill="white" />
	</g>
    </svg>




    <svg viewBox="0 0 450 600"  class=" absolute top-0 left-0 w-full h-full pointer-events-none">
            
        <motion.path
        id="path5"
        class="blur-[2px]"
        d="M225 151.5C231.182 168.5 220.593 182.345 208 188C182.035 199.659 158.058 224.243 150.231 252.5C144.158 274.422 152.797 302.673 150.231 325.5C148.432 341.5 138 376.5 100.5 376.5C59.1175 376.5 56.3209 317.117 59.1173 285.6C61.5629 258.036 73.1337 231.922 89.0145 209.514C109.431 180.687 127 165.5 159.5 147.5C173.5 139.746 183.717 136.802 190 135C202 132 218.818 134.5 225 151.5Z"
        stroke="#ffffff"
        stroke-width="1"
        fill="none"
        :initial="{ pathLength: 0 }"
        :animate="{ pathLength: 1 }"
        :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
        />
         <g id="rect5">
		 <circle ref="dotEl" r=".12" fill="white" />
	</g>
    </svg>




    <svg viewBox="0 0 450 600"  class=" absolute top-0 left-0 w-full h-full pointer-events-none">
            
        <motion.path
        id="path4"
        class="blur-[6px]"
        d="M157.5 367C154 366.5 149 377.5 139 385C129 392.5 121.036 393.576 115 398.5C95.9989 414 104.859 443.825 123.5 454.5C146.293 467.552 178 450.5 175 425C173.883 415.506 168.512 403.65 165.5 391C163 380.5 161 367.5 157.5 367Z"
        stroke="#ffffff"
        stroke-width="4"
        fill="none"
        :initial="{ pathLength: 0 }"
        :animate="{ pathLength: 1 }"
        :transition="{ duration: 3, ease: 'easeInOut', delay: 0 }"
        />
        <g id="rect4">
		 <circle ref="dotEl" r=".08" fill="white" />
	</g>
    </svg>




</template>