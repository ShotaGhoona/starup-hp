'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

const NUM_ROWS = 3;
const NUM_LOCAL_IMAGES = 23; // Number of actual images in picture-wall folder
const NUM_IMAGES = 50; // Total images to display (will loop local images)
const SCROLL_SPEED = 0.5; // pixels per frame

interface ImageData {
  url: string;
  width: number;
  height: number;
}

export const PhotoGalleryWall: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const wallRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Use local images from picture-wall folder
  const images: ImageData[] = useMemo(() => {
    const imgs: ImageData[] = [];
    for (let i = 0; i < NUM_IMAGES; i++) {
      // Loop through the 23 images
      const imageNumber = (i % NUM_LOCAL_IMAGES) + 1;
      const imagePath = `/images/recruit/picture-wall/${String(imageNumber).padStart(3, '0')}.jpg`;
      imgs.push({
        url: imagePath,
        width: 300, // Default width
        height: 250, // Default height
      });
    }
    return imgs;
  }, []);

  // Create rows with images
  const rows = useMemo(() => {
    const rowsData: ImageData[][] = Array.from({ length: NUM_ROWS }, () => []);

    images.forEach((image, i) => {
      const rowIndex = i % NUM_ROWS;
      rowsData[rowIndex].push(image);
    });

    return rowsData;
  }, [images]);

  // Calculate total width of one set of rows
  const totalWidth = useMemo(() => {
    if (rows.length === 0) return 0;
    // Approximate width: each image is roughly 300px + 10px margin
    const imagesPerRow = Math.ceil(NUM_IMAGES / NUM_ROWS);
    return imagesPerRow * 310; // 300px average + 10px margin
  }, [rows]);

  // Auto scroll animation
  useEffect(() => {
    const animate = () => {
      setScrollPosition((prev) => {
        const newPosition = prev + SCROLL_SPEED;
        // Reset when scrolled past one full set
        if (newPosition >= totalWidth) {
          return 0;
        }
        return newPosition;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [totalWidth]);

  return (
    <div
      className="relative w-screen h-[400px] md:h-[500px] lg:h-[480px] bg-transparent overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <style jsx>{`
        @media (min-width: 700px) {
          .wall-container {
            perspective: 1500px;
          }
        }

        @media (min-width: 1200px) {
          .wall-container {
            perspective: 2000px;
          }
        }

        @media (min-width: 1600px) {
          .wall-container {
            perspective: 2500px;
          }
        }

        .frame::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.5) 100%);
          transform-origin: bottom center;
          transform: rotateX(180deg) translateY(-20px);
        }
      `}</style>

      {/* Text overlay - positioned above the wall */}
      <div className="max-w-[1500px] mx-auto relative">

        <div className="absolute top-8 right-8 z-10 pointer-events-none text-right">
          <h2
            className="text-4xl md:text-6xl text-white"
            style={{
              textShadow: '0 0 8px rgba(182, 182, 182, 0.8), 0 0 16px rgba(182, 182, 182, 0.6), 2px 2px 4px rgba(182, 182, 182, 0.9)'
            }}
          >
            Ready to make
          </h2>
          <p
            className="text-3xl lg:text-7xl text-white"
            style={{
              textShadow: '0 0 8px rgba(182, 182, 182, 0.8), 0 0 16px rgba(182, 182, 182, 0.6), 2px 2px 4px rgba(182, 182, 182, 0.9)'
            }}
          >
            Impact?
          </p>
        </div>
        <svg width="122" height="97" viewBox="0 0 122 97" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-30 right-90 rotate-[180deg] z-10'>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M116.102 0.0996005C114.952 0.334095 112.7 1.53002 111.433 2.53834C110.869 2.98388 109.368 4.15635 108.077 5.11778C103.455 8.6352 102.61 9.40903 102.187 10.4877C101.39 12.5982 102.798 14.5914 105.097 14.5914C106.13 14.5914 108.241 13.7941 109.696 12.8561C110.424 12.3871 111.01 12.0823 111.01 12.1526C111.01 12.692 107.796 17.8274 106.2 19.8206C102.023 25.0733 95.6642 29.6928 86.2548 34.2889C81.0926 36.8214 77.4555 38.2753 73.9123 39.2367C71.7066 39.823 70.6507 39.9871 67.9053 40.0809C66.0516 40.1513 64.5499 40.1747 64.5499 40.1278C64.5499 40.0809 64.808 38.9788 65.1365 37.6891C65.465 36.3993 65.8404 34.1716 66.0047 32.7647C66.4505 28.3796 65.4884 24.2994 63.4704 22.2359C62.1564 20.8758 60.9363 20.3599 59.0121 20.3599C57.6043 20.3599 57.1115 20.4537 55.7975 21.1103C52.8878 22.5407 50.5648 25.9878 49.5089 30.4197C48.453 34.922 49.2742 38.0877 52.3481 41.1127C53.4744 42.2148 54.46 42.9183 55.9852 43.6921C57.1584 44.2549 58.1439 44.7473 58.1909 44.7708C58.5898 45.0053 54.5304 53.4705 52.0666 57.6211C47.4674 65.3125 39.3486 74.575 30.5728 82.0789C22.2427 89.2309 16.7285 92.4435 9.87677 94.1553C8.28116 94.554 7.13138 94.6478 4.2452 94.6478C1.17131 94.6712 0.608154 94.7181 0.608154 95.023C0.608154 95.234 1.19478 95.5857 2.13337 95.9609C3.54126 96.4768 3.96363 96.5472 7.41296 96.5237C10.5572 96.5237 11.4724 96.4299 13.1149 96.0078C21.7265 93.6863 31.1594 87.1908 42.6102 75.7006C49.2977 69.0175 52.5828 64.9373 56.1494 58.9343C58.0501 55.7217 60.6312 50.6801 61.7575 47.9365L62.5553 45.9902L64.0806 46.1543C71.3547 46.9047 77.7136 45.3101 88.3667 40.034C96.2274 36.1414 101.976 32.3426 106.505 28.0748C108.617 26.0816 111.855 22.2828 112.794 20.7117C113.028 20.313 113.286 19.9847 113.357 19.9847C113.427 19.9847 113.662 20.782 113.873 21.72C114.084 22.6814 114.647 24.276 115.093 25.2609C115.82 26.8085 116.008 27.043 116.454 26.9727C116.876 26.9258 117.228 26.4333 117.956 24.9795C119.317 22.2828 119.833 20.2661 120.772 13.8879C121.757 7.25168 121.781 4.4143 120.889 2.56179C119.95 0.615488 118.12 -0.322489 116.102 0.0996005ZM60.7016 25.7767C61.4525 26.9023 61.8279 29.2942 61.6637 31.9205C61.4759 34.7813 60.5139 38.9788 60.0681 38.9788C59.5284 38.9788 57.1584 37.6422 56.2198 36.8214C54.8354 35.6021 54.3426 34.2889 54.5538 32.2957C54.8589 29.2473 56.1964 26.2223 57.5808 25.3547C58.7306 24.6512 60.0681 24.8388 60.7016 25.7767Z" fill="currentColor"/>
        </svg>


      </div>

      {/* Wall - 内側は大きめの高さを持つが、外側のコンテナでクリッピングされる */}
      <div
        ref={wallRef}
        className="wall-container relative w-full h-[1000px]"
        style={{
          transformOrigin: 'left center',
          transform: `rotateY(30deg) rotatez(7deg) translateX(${-scrollPosition}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {rows.map((rowImages, rowIndex) => {
          const isBottomRow = rowIndex === NUM_ROWS - 1;

          return (
            <div
              key={rowIndex}
              className="relative flex h-[250px] mb-[10px]"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Render each row's images twice for infinite loop */}
              {[0, 1].map((setIndex) => (
                <React.Fragment key={setIndex}>
                  {rowImages.map((image, imgIndex) => {
                    if (isBottomRow) {
                      return (
                        <div
                          key={`${setIndex}-${imgIndex}`}
                          className="frame relative h-full group cursor-pointer"
                          style={{
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`Gallery ${imgIndex}`}
                            className="h-full m-[5px] grayscale group-hover:grayscale-0 transition-all duration-500"
                            style={{
                              transform: 'translateZ(0px)',
                              transition: 'all 0.5s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateZ(50px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateZ(0px)';
                            }}
                          />
                          <div
                            className="absolute h-full opacity-25 pointer-events-none"
                            style={{
                              transform: 'rotateX(180deg) translateY(-10px)',
                            }}
                          >
                            <img
                              src={image.url}
                              alt={`Reflection ${imgIndex}`}
                              className="h-full m-[5px] grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <img
                          key={`${setIndex}-${imgIndex}`}
                          src={image.url}
                          alt={`Gallery ${imgIndex}`}
                          className="h-full m-[5px] grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                          style={{
                            transform: 'translateZ(0px)',
                            transition: 'all 0.5s ease',
                            transformStyle: 'preserve-3d',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateZ(50px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateZ(0px)';
                          }}
                        />
                      );
                    }
                  })}
                </React.Fragment>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoGalleryWall;
