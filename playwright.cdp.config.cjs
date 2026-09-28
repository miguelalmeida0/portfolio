const {defineConfig,devices}=require('@playwright/test');
const run=process.env.CDP_RUN??'portfolio-cdp-results';
module.exports=defineConfig({
 testDir:'../flow/film/flow-portfolio-loop/.cdp-tests/portfolio/specs',workers:2,retries:0,fullyParallel:false,
 timeout:30000,expect:{timeout:8000},
 outputDir:`../flow/film/flow-portfolio-loop/output/qa/${run}`,
 reporter:[['list'],['json',{outputFile:`../flow/film/flow-portfolio-loop/output/qa/${run}.json`}]],
 use:{baseURL:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4173',trace:'off',screenshot:'only-on-failure',video:'off',actionTimeout:10000,navigationTimeout:20000},
 projects:[
  {name:'chromium-desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},
  {name:'chromium-mobile',use:{...devices['Pixel 7'],viewport:{width:390,height:844}}},
 ],
});
