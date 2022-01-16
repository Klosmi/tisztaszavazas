import styled from "styled-components"

const Outer = styled.div`
  position: relative;
  transition: .3s;
`

const EyeWrap = styled.div`
  position: absolute;
  width: 81px;
  left: 5px;
  z-index: 1;
`

const TextWrap = styled.div`
  position: absolute;
  top: 45px;
  transition: .3s;
`

const MultipartLogo = ({
  eyeForwardRef,
  outerForwardRef,
  textForwardRef,
}) => {
  return (
    <Outer ref={outerForwardRef}>
      <EyeWrap ref={eyeForwardRef}>
        <svg viewBox="-0.003 -0.002 94.041 45.383" xmlns="http://www.w3.org/2000/svg">
          <path d="M 36.783 45.244 C 31.267 45.895 25.791 44.164 20.536 41.45 C 17.403 39.803 14.41 37.901 11.588 35.764 C 9.861 34.408 8.328 32.821 7.033 31.048 C 5.531 29.1 3.979 27.189 2.5 25.223 C 1.818 24.294 1.195 23.323 0.633 22.317 C 0.134 21.44 -0.08 20.428 0.021 19.424 C 0.122 17.673 1.36 16.195 3.067 15.79 C 3.732 15.613 4.353 15.301 4.891 14.873 C 7.227 13.112 9.728 11.581 12.358 10.3 C 12.99 10.016 13.592 9.672 14.158 9.273 C 16.177 7.798 18.362 6.565 20.669 5.6 C 31.669 0.823 43.74 -0.946 55.648 0.474 C 56.568 0.552 57.482 0.692 58.383 0.894 C 63.516 2.227 68.655 3.545 73.76 4.986 C 76.155 5.735 78.386 6.93 80.337 8.508 C 82.418 10.092 84.493 11.684 86.599 13.233 C 89.142 15.114 91.313 17.452 93 20.128 C 94.577 22.27 94.332 25.247 92.426 27.103 C 91.54 28.01 90.573 28.834 89.537 29.566 C 84.841 33.01 79.584 35.616 74 37.269 C 70.645 38.269 67.332 39.399 63.971 40.369 C 61.425 41.104 58.84 41.711 56.26 42.319 C 53.94 42.865 51.591 43.286 49.276 43.85 C 45.19 44.869 40.986 45.338 36.776 45.243 M 56.7 19.9 C 56.761 18.701 56.446 17.512 55.8 16.5 C 55.125 15.373 54.201 14.416 53.1 13.7 C 50.89 12.289 48.388 11.397 45.784 11.092 C 44.188 10.869 42.596 10.618 41.007 10.339 C 39.865 10.139 39.838 10.085 39.323 11.139 C 37.96 13.939 36.575 16.723 35.305 19.56 C 34.797 20.762 34.414 22.013 34.162 23.293 C 33.982 24.158 33.942 25.045 34.041 25.923 C 34.313 28.37 35.414 30.199 37.985 30.867 C 39.507 31.267 41.009 31.742 42.513 32.209 C 45.237 32.966 48.133 32.829 50.774 31.819 C 52.242 31.405 53.475 30.404 54.18 29.051 C 55.619 26.198 56.476 23.087 56.7 19.9 M 33.974 9.48 C 33.618 9.489 33.262 9.516 32.909 9.562 C 28.644 10.403 24.458 11.599 20.393 13.14 C 17.294 14.341 14.54 16.29 12.378 18.814 C 11.678 19.614 11.011 20.453 10.312 21.297 C 11.73 23.32 13.043 25.26 14.435 27.146 C 14.967 27.853 15.586 28.491 16.276 29.046 C 20.315 32.328 24.899 34.875 29.819 36.57 C 30.062 36.63 30.311 36.668 30.561 36.683 C 30.559 36.613 30.549 36.544 30.53 36.477 C 30.492 36.411 30.445 36.35 30.391 36.296 C 26.811 32.902 25.691 28.647 26.156 23.896 C 26.449 21.047 27.467 18.321 29.112 15.976 C 30.392 14.107 31.819 12.338 33.182 10.525 C 33.404 10.225 33.633 9.936 33.976 9.487 M 82.818 22.05 C 82.309 21.583 81.887 21.14 81.41 20.77 C 79.134 19.002 76.892 17.183 74.538 15.528 C 73.311 14.67 71.974 13.982 70.564 13.48 C 68.106 12.606 65.572 11.94 63.064 11.2 C 62.832 11.17 62.597 11.167 62.364 11.193 C 62.507 11.486 62.573 11.664 62.672 11.821 C 64.593 14.93 65.275 18.648 64.582 22.237 C 64.022 25.143 63.231 27.999 62.217 30.779 C 62.117 31.079 62.044 31.389 61.909 31.872 C 69.29 29.285 76.56 27.007 82.818 22.049" fill="#ffd500" />
          <path d="M 45.242 16.113 C 45.432 16.135 45.894 16.158 46.342 16.247 C 48.801 16.587 50.677 18.618 50.821 21.096 C 51.012 23.725 49.339 26.131 46.808 26.867 C 46.071 27.081 45.312 27.21 44.546 27.251 C 41.848 27.428 39.493 25.44 39.214 22.751 C 38.823 19.179 41.647 16.07 45.24 16.118" fill="#161615" />
        </svg>
      </EyeWrap>
      <TextWrap ref={textForwardRef}>
        <svg viewBox="101.85 3.694 91.431 20.911" xmlns="http://www.w3.org/2000/svg">
          <path d="M93.544,23.921V8.179H88.372V3.365h15.713V8.179H98.912V23.921Z" transform="matrix(1, 0, 0, 1, 13.478, 0.513)" fill="#161615" />
          <rect width="5.367" height="20.556" transform="matrix(1, 0, 0, 1, 119.527, 3.878)" fill="#161615" />
          <path d="M 134.385 24.6 C 133.775 24.6 133.18 24.582 132.599 24.545 C 132.019 24.508 131.446 24.453 130.884 24.379 C 130.322 24.305 129.784 24.223 129.266 24.13 C 128.748 24.037 128.253 23.93 127.772 23.798 L 127.772 19.537 C 128.4 19.592 129.072 19.637 129.805 19.675 C 130.538 19.713 131.272 19.741 132.019 19.758 C 132.766 19.775 133.461 19.786 134.109 19.786 C 134.62 19.796 135.13 19.75 135.63 19.648 C 135.97 19.589 136.286 19.435 136.543 19.205 C 136.752 18.981 136.86 18.681 136.843 18.375 L 136.843 18.043 C 136.866 17.685 136.704 17.341 136.414 17.13 C 136.118 16.926 135.764 16.821 135.404 16.83 L 133.937 16.83 C 132.198 16.953 130.472 16.453 129.068 15.418 C 127.963 14.477 127.409 12.901 127.407 10.688 L 127.407 9.772 C 127.278 8.054 127.952 6.373 129.233 5.221 C 130.756 4.12 132.617 3.587 134.492 3.712 C 135.31 3.709 136.127 3.751 136.94 3.836 C 137.704 3.919 138.423 4.019 139.098 4.136 C 139.772 4.257 140.374 4.381 140.911 4.509 L 140.911 8.775 C 140.063 8.701 139.111 8.641 138.048 8.595 C 136.985 8.549 136.021 8.526 135.155 8.526 C 134.692 8.522 134.229 8.559 133.772 8.637 C 133.421 8.685 133.092 8.839 132.832 9.08 C 132.594 9.344 132.474 9.694 132.5 10.048 L 132.5 10.325 C 132.474 10.726 132.638 11.116 132.943 11.377 C 133.341 11.647 133.819 11.774 134.298 11.737 L 136.125 11.737 C 137.244 11.697 138.355 11.949 139.347 12.47 C 140.175 12.928 140.849 13.621 141.283 14.462 C 141.728 15.35 141.951 16.333 141.934 17.326 L 141.934 18.239 C 142.021 19.636 141.704 21.029 141.02 22.251 C 140.413 23.172 139.487 23.837 138.42 24.118 C 137.103 24.465 135.745 24.628 134.383 24.602" fill="#161615" />
          <path d="M 143.9 24.434 L 143.9 20.173 L 151.563 8.692 L 143.9 8.692 L 143.9 3.878 L 158.093 3.878 L 158.093 8.139 L 150.429 19.62 L 158.093 19.62 L 158.093 24.434 Z" fill="#161615" />
          <path d="M 164.677 24.434 L 164.677 8.692 L 159.507 8.692 L 159.507 3.878 L 175.217 3.878 L 175.217 8.692 L 170.043 8.692 L 170.043 24.434 Z" fill="#161615" />
          <path d="M 174.417 24.434 L 180.502 3.878 L 187.202 3.878 L 193.281 24.434 L 187.72 24.434 L 186.89 21.169 L 180.719 21.169 L 179.919 24.434 Z M 181.969 16.355 L 185.649 16.355 L 183.795 8.442 Z" fill="#161615" />
        </svg>
        <svg viewBox="103.259 27.212 89.439 16.857" xmlns="http://www.w3.org/2000/svg">
          <path d="M 107.797 44.069 C 107.402 44.069 107.016 44.057 106.64 44.033 C 106.264 44.009 105.894 43.973 105.529 43.926 C 105.164 43.878 104.813 43.826 104.479 43.763 C 104.145 43.7 103.822 43.632 103.511 43.549 L 103.511 40.786 C 103.917 40.823 104.356 40.853 104.828 40.877 C 105.3 40.901 105.778 40.919 106.263 40.93 C 106.748 40.942 107.198 40.948 107.617 40.948 C 107.948 40.954 108.278 40.924 108.602 40.858 C 108.822 40.819 109.027 40.72 109.194 40.571 C 109.332 40.427 109.404 40.232 109.394 40.033 L 109.394 39.817 C 109.409 39.585 109.304 39.362 109.116 39.226 C 108.925 39.091 108.695 39.021 108.461 39.026 L 107.51 39.026 C 106.383 39.106 105.264 38.782 104.354 38.112 C 103.558 37.3 103.164 36.176 103.278 35.045 L 103.278 34.453 C 103.195 33.34 103.632 32.251 104.462 31.504 C 105.45 30.791 106.655 30.446 107.87 30.527 C 108.4 30.525 108.93 30.552 109.457 30.608 C 109.952 30.662 110.419 30.729 110.857 30.808 C 111.295 30.887 111.686 30.968 112.031 31.05 L 112.031 33.813 C 111.481 33.765 110.861 33.725 110.174 33.695 C 109.487 33.665 108.862 33.651 108.3 33.651 C 107.998 33.647 107.697 33.671 107.4 33.722 C 107.172 33.752 106.959 33.853 106.79 34.009 C 106.636 34.18 106.558 34.406 106.574 34.636 L 106.574 34.816 C 106.557 35.076 106.664 35.328 106.862 35.497 C 107.12 35.672 107.429 35.754 107.74 35.73 L 108.922 35.73 C 109.649 35.704 110.369 35.868 111.013 36.206 C 111.549 36.503 111.985 36.952 112.267 37.496 C 112.555 38.072 112.7 38.709 112.688 39.353 L 112.688 39.94 C 112.745 40.845 112.54 41.748 112.097 42.54 C 111.704 43.138 111.103 43.569 110.411 43.751 C 109.557 43.975 108.677 44.08 107.794 44.064" fill="#161615" />
          <path d="M 113.965 43.961 L 113.965 41.199 L 118.932 33.756 L 113.965 33.756 L 113.965 30.636 L 123.165 30.636 L 123.165 33.397 L 118.198 40.84 L 123.165 40.84 L 123.165 43.96 Z" fill="#161615" />
          <path d="M 123.881 43.961 L 127.827 30.636 L 132.166 30.636 L 136.111 43.961 L 132.506 43.961 L 131.969 41.844 L 127.969 41.844 L 127.448 43.961 Z M 128.781 38.724 L 131.167 38.724 L 129.967 33.595 Z" fill="#161615" />
          <path d="M 139.61 43.961 L 135.664 30.637 L 139.269 30.637 L 141.798 40.178 L 144.327 30.637 L 147.895 30.637 L 143.952 43.961 Z" fill="#161615" />
          <path d="M 147.447 43.961 L 151.393 30.636 L 155.732 30.636 L 159.677 43.961 L 156.072 43.961 L 155.535 41.844 L 151.535 41.844 L 151.014 43.961 Z M 152.347 38.724 L 154.733 38.724 L 153.533 33.595 Z" fill="#161615" />
          <path d="M 160.396 43.961 L 160.396 41.199 L 165.363 33.756 L 160.396 33.756 L 160.396 30.636 L 169.596 30.636 L 169.596 33.397 L 164.625 40.841 L 169.592 40.841 L 169.592 43.961 Z" fill="#161615" />
          <path d="M 170.313 43.962 L 174.259 30.637 L 178.598 30.637 L 182.543 43.962 L 178.943 43.962 L 178.405 41.845 L 174.405 41.845 L 173.884 43.962 Z M 175.213 38.725 L 177.599 38.725 L 176.399 33.596 Z M 175.5 29.776 L 176.719 27.212 L 179.482 27.212 L 177.538 29.775 Z" fill="#161615" />
          <path d="M 187.798 44.069 C 187.403 44.069 187.017 44.057 186.641 44.033 C 186.265 44.009 185.895 43.973 185.53 43.926 C 185.163 43.878 184.813 43.826 184.48 43.763 C 184.147 43.7 183.822 43.632 183.512 43.549 L 183.512 40.786 C 183.912 40.823 184.357 40.853 184.828 40.877 C 185.299 40.901 185.779 40.918 186.264 40.93 C 186.749 40.942 187.198 40.948 187.617 40.948 C 187.948 40.954 188.279 40.924 188.604 40.858 C 188.824 40.819 189.029 40.72 189.196 40.571 C 189.334 40.427 189.406 40.232 189.396 40.033 L 189.396 39.817 C 189.411 39.585 189.306 39.362 189.118 39.226 C 188.926 39.092 188.696 39.022 188.462 39.026 L 187.512 39.026 C 186.385 39.106 185.265 38.782 184.355 38.112 C 183.56 37.299 183.166 36.176 183.28 35.045 L 183.28 34.453 C 183.197 33.34 183.633 32.252 184.462 31.504 C 185.45 30.791 186.655 30.446 187.87 30.527 C 188.4 30.525 188.93 30.552 189.457 30.608 C 189.954 30.662 190.42 30.729 190.857 30.808 C 191.294 30.887 191.685 30.968 192.03 31.05 L 192.03 33.813 C 191.481 33.765 190.861 33.725 190.174 33.695 C 189.487 33.665 188.862 33.651 188.3 33.651 C 187.998 33.647 187.697 33.671 187.4 33.722 C 187.172 33.752 186.959 33.853 186.79 34.009 C 186.636 34.18 186.558 34.406 186.573 34.636 L 186.573 34.816 C 186.557 35.076 186.663 35.328 186.861 35.497 C 187.119 35.672 187.429 35.754 187.74 35.73 L 188.922 35.73 C 189.649 35.704 190.369 35.868 191.013 36.206 C 191.549 36.504 191.986 36.953 192.268 37.497 C 192.556 38.073 192.7 38.71 192.688 39.354 L 192.688 39.94 C 192.745 40.845 192.54 41.748 192.097 42.54 C 191.704 43.138 191.103 43.57 190.411 43.751 C 189.558 43.975 188.677 44.081 187.795 44.064" fill="#161615" />
        </svg>
      </TextWrap>
    </Outer>
  )
}

export default MultipartLogo