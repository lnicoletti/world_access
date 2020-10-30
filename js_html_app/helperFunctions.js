function makeSlider(sliderId, initialWeight){
    // Make the slider
    var sliderWeights = d3
    .sliderBottom()
    .min(d3.min(dataWeights))
    .max(d3.max(dataWeights))
    .step(0.001)
    .width(265)
    .tickValues(dataWeights)
    .default(initialWeight)
    // .on('onchange', val => {
    //   d3.select('p#value').text(d3.timeFormat('%Y')(val));
    // console.log(val)});

    var weights = d3
    .selectAll(sliderId)
    .append("left")
    .append('svg')
    .attr('width', 300)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(15,10)')

    // var cWeights = d3
    // .selectAll('#sliderC')
    // .append("center")
    // .append('svg')
    // .attr('width', 300)
    // .attr('height', 50)
    // .append('g')
    // .attr('transform', 'translate(15,10)')

    // alWeights.call(sliderWeights);
    weights.call(sliderWeights)
    return sliderWeights
}

// function to reset the sliders
function resetSliders(initialWeights) {
    sliderAL.value(initialWeights.alWeight)
    sliderC.value(initialWeights.cWeight)
    sliderED.value(initialWeights.edWeight)
    sliderFC.value(initialWeights.fcWeight)
    sliderHWB.value(initialWeights.hwbWeight)
    sliderM.value(initialWeights.mWeight)
    sliderN.value(initialWeights.nWeight)
}

// Calculate new accessibility score
function accessScore(data, weightData) {
    data.features.forEach(d=> d.properties.accessibil_sc = weightData.alWeight*d.properties.active_liv_r + 
        weightData.cWeight*d.properties.community_r + weightData.edWeight*d.properties.education_r + 
        weightData.fcWeight*d.properties.food_choic_r + weightData.hwbWeight*d.properties.health_wel_r + 
        weightData.mWeight*d.properties.mobility_r + weightData.nWeight*d.properties.nightlife_r);
}

 // make weights responsive so that they always add up to 100%
 function responsiveWeights(slider, weightUpdated, val) {
    // make other sliders responsive so as to not go over or below 100%
   // if slider was increased, decrease the other ones
   // console.log(slider)
   if (val>newWeights[weightUpdated]) {
       // get weight increase difference
       WeightIncrease = val - newWeights[weightUpdated]
       console.log(WeightIncrease)
       // update focus slider with new value
       newWeights[weightUpdated] = val
       // clone newWeights so as to not mess with the newWeights object
       newWeightsTemp = _.clone(newWeights)
       // remove updated weight from clone
       delete newWeightsTemp[weightUpdated]
       // decrease other sliders so as to not go over 100%
       console.log(Object.keys(newWeightsTemp)[0])
       newWeights[Object.keys(newWeightsTemp)[0]] = newWeights[Object.keys(newWeightsTemp)[0]] === 0?  0 : 
                                                       newWeights[Object.keys(newWeightsTemp)[0]] - (WeightIncrease/6)
       // update slider handle
       sliders.filter(d=>d!=slider)[0].value(newWeights[Object.keys(newWeightsTemp)[0]])
       newWeights[Object.keys(newWeightsTemp)[1]] = newWeights[Object.keys(newWeightsTemp)[1]] === 0?  0 : 
                                                       newWeights[Object.keys(newWeightsTemp)[1]] - (WeightIncrease/6)
       sliders.filter(d=>d!=slider)[1].value(newWeights[Object.keys(newWeightsTemp)[1]])
       newWeights[Object.keys(newWeightsTemp)[2]] = newWeights[Object.keys(newWeightsTemp)[2]] === 0?  0 : 
                                                       newWeights[Object.keys(newWeightsTemp)[2]] - (WeightIncrease/6)
       sliders.filter(d=>d!=slider)[2].value(newWeights[Object.keys(newWeightsTemp)[2]])
       newWeights[Object.keys(newWeightsTemp)[3]] = newWeights[Object.keys(newWeightsTemp)[3]] === 0?  0 : 
                                                       newWeights[Object.keys(newWeightsTemp)[3]] - (WeightIncrease/6)
       sliders.filter(d=>d!=slider)[3].value(newWeights[Object.keys(newWeightsTemp)[3]])
       newWeights[Object.keys(newWeightsTemp)[4]] = newWeights[Object.keys(newWeightsTemp)[4]] === 0?  0 : 
                                                       newWeights[Object.keys(newWeightsTemp)[4]] - (WeightIncrease/6)
       sliders.filter(d=>d!=slider)[4].value(newWeights[Object.keys(newWeightsTemp)[4]])
       newWeights[Object.keys(newWeightsTemp)[5]] = newWeights[Object.keys(newWeightsTemp)[5]] === 0?  0 : 
                                                       newWeights[Object.keys(newWeightsTemp)[5]] - (WeightIncrease/6)
       sliders.filter(d=>d!=slider)[5].value(newWeights[Object.keys(newWeightsTemp)[5]])
   // if slider was decreased, increase the other ones
   } else if (val<newWeights.weightUpdated) {
       // get weight decrease difference
       WeightDecrease = newWeights.weightUpdated - val
       console.log(WeightDecrease)
       // update focus slider with new value
       newWeights.weightUpdated = val
       // clone newWeights so as to not mess with the newWeights object
       newWeightsTemp = _.clone(newWeights)
       // remove updated weight from clone
       delete newWeightsTemp.weightUpdated
       // decrease other sliders so as to not go over 100%
       newWeights[Object.keys(newWeightsTemp)[0]] = newWeights[Object.keys(newWeightsTemp)[0]] + (WeightDecrease/6)
       // update slider handle
       sliders.filter(d=>d!=slider)[0].value(newWeights[Object.keys(newWeightsTemp)[0]])
       newWeights[Object.keys(newWeightsTemp)[1]] = newWeights[Object.keys(newWeightsTemp)[1]] + (WeightDecrease/6)
       sliders.filter(d=>d!=slider)[1].value(newWeights[Object.keys(newWeightsTemp)[1]])
       newWeights[Object.keys(newWeightsTemp)[2]] = newWeights[Object.keys(newWeightsTemp)[2]] + (WeightDecrease/6)
       sliders.filter(d=>d!=slider)[2].value(newWeights[Object.keys(newWeightsTemp)[2]])
       newWeights[Object.keys(newWeightsTemp)[3]] = newWeights[Object.keys(newWeightsTemp)[3]] + (WeightDecrease/6)
       sliders.filter(d=>d!=slider)[3].value(newWeights[Object.keys(newWeightsTemp)[3]])
       newWeights[Object.keys(newWeightsTemp)[4]] = newWeights[Object.keys(newWeightsTemp)[1]] + (WeightDecrease/6)
       sliders.filter(d=>d!=slider)[4].value(newWeights[Object.keys(newWeightsTemp)[4]])
       newWeights[Object.keys(newWeightsTemp)[5]] = newWeights[Object.keys(newWeightsTemp)[1]] + (WeightDecrease/6)
       sliders.filter(d=>d!=slider)[5].value(newWeights[Object.keys(newWeightsTemp)[5]])
   }
}

    // update map and histogram/kde with the new weights
    function updateWeights(slider, data, selected_city, status) {
            
            slider.on("onchange", val => {
                if(status === 0) {
                    return;
                    // resetSliders(initialWeights)
                }else{

                if (slider===sliderAL) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.alWeight) {
                        // get weight increase difference
                        alWeightIncrease = val - newWeights.alWeight
                        // console.log(alWeightIncrease)
                        // update focus slider with new value
                        newWeights.alWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (alWeightIncrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (alWeightIncrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (alWeightIncrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (alWeightIncrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (alWeightIncrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (alWeightIncrease/6)
                        sliderN.value(newWeights.nWeight)

                        // newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (alWeightIncrease*newWeights.cWeight*1.2)
                        // // update slider handle
                        // sliderC.value(newWeights.cWeight)
                        // newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (alWeightIncrease*newWeights.edWeight*1.2)
                        // sliderED.value(newWeights.edWeight)
                        // newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (alWeightIncrease*newWeights.fcWeight*1.2)
                        // sliderFC.value(newWeights.fcWeight)
                        // newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (alWeightIncrease*newWeights.hwbWeight*1.2)
                        // sliderHWB.value(newWeights.hwbWeight)
                        // newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (alWeightIncrease*newWeights.mWeight*1.2)
                        // sliderM.value(newWeights.mWeight)
                        // newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (alWeightIncrease*newWeights.nWeight*1.2)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.alWeight) {
                        // get weight decrease difference
                        alWeightDecrease = newWeights.alWeight - val
                        // console.log(alWeightDecrease)
                        // update focus slider with new value
                        newWeights.alWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight + (alWeightDecrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight + (alWeightDecrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight + (alWeightDecrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight + (alWeightDecrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight + (alWeightDecrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight + (alWeightDecrease/6)
                        sliderN.value(newWeights.nWeight)
                    }
                } else if (slider===sliderC) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.cWeight) {
                        // get weight increase difference
                        cWeightIncrease = val - newWeights.cWeight
                        // console.log(cWeightIncrease)
                        // update focus slider with new value
                        newWeights.cWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.alWeight = newWeights.alWeight === 0?  0 : newWeights.alWeight - (cWeightIncrease/6)
                        // update slider handle
                        sliderAL.value(newWeights.alWeight)
                        newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (cWeightIncrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (cWeightIncrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (cWeightIncrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (cWeightIncrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (cWeightIncrease/6)
                        sliderN.value(newWeights.nWeight)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.cWeight) {
                        // get weight decrease difference
                        cWeightDecrease = newWeights.cWeight - val
                        // console.log(cWeightDecrease)
                        // update focus slider with new value
                        newWeights.cWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.alWeight = newWeights.alWeight + (cWeightDecrease/6)
                        // update slider handle
                        sliderAL.value(newWeights.alWeight)
                        newWeights.edWeight = newWeights.edWeight + (cWeightDecrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight + (cWeightDecrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight + (cWeightDecrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight + (cWeightDecrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight + (cWeightDecrease/6)
                        sliderN.value(newWeights.nWeight)
                    }
                } else if (slider===sliderED) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.edWeight) {
                        // get weight increase difference
                        edWeightIncrease = val - newWeights.edWeight
                        // console.log(edWeightIncrease)
                        // update focus slider with new value
                        newWeights.edWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (edWeightIncrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.alWeight = newWeights.alWeight === 0?  0 : newWeights.alWeight - (edWeightIncrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (edWeightIncrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (edWeightIncrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (edWeightIncrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (edWeightIncrease/6)
                        sliderN.value(newWeights.nWeight)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.edWeight) {
                        // get weight decrease difference
                        edWeightDecrease = newWeights.edWeight - val
                        // console.log(edWeightDecrease)
                        // update focus slider with new value
                        newWeights.edWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight + (edWeightDecrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.alWeight = newWeights.alWeight + (edWeightDecrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.fcWeight = newWeights.fcWeight + (edWeightDecrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight + (edWeightDecrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight + (edWeightDecrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight + (edWeightDecrease/6)
                        sliderN.value(newWeights.nWeight)
                    }
                } else if (slider===sliderFC) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.fcWeight) {
                        // get weight increase difference
                        fcWeightIncrease = val - newWeights.fcWeight
                        // console.log(fcWeightIncrease)
                        // update focus slider with new value
                        newWeights.fcWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (fcWeightIncrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (fcWeightIncrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.alWeight = newWeights.alWeight === 0?  0 : newWeights.alWeight - (fcWeightIncrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (fcWeightIncrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (fcWeightIncrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (fcWeightIncrease/6)
                        sliderN.value(newWeights.nWeight)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.fcWeight) {
                        // get weight decrease difference
                        fcWeightDecrease = newWeights.fcWeight - val
                        // console.log(fcWeightDecrease)
                        // update focus slider with new value
                        newWeights.fcWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight + (fcWeightDecrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight + (fcWeightDecrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.alWeight = newWeights.alWeight + (fcWeightDecrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight + (fcWeightDecrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight + (fcWeightDecrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight + (fcWeightDecrease/6)
                        sliderN.value(newWeights.nWeight)
                    }
                } else if (slider===sliderHWB) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.hwbWeight) {
                        // get weight increase difference
                        hwbWeightIncrease = val - newWeights.hwbWeight
                        // console.log(hwbWeightIncrease)
                        // update focus slider with new value
                        newWeights.hwbWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (hwbWeightIncrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (hwbWeightIncrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (hwbWeightIncrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.alWeight = newWeights.alWeight === 0?  0 : newWeights.alWeight - (hwbWeightIncrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (hwbWeightIncrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (hwbWeightIncrease/6)
                        sliderN.value(newWeights.nWeight)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.hwbWeight) {
                        // get weight decrease difference
                        hwbWeightDecrease = newWeights.hwbWeight - val
                        // console.log(hwbWeightDecrease)
                        // update focus slider with new value
                        newWeights.hwbWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight + (hwbWeightDecrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight + (hwbWeightDecrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight + (hwbWeightDecrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.alWeight = newWeights.alWeight + (hwbWeightDecrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.mWeight = newWeights.mWeight + (hwbWeightDecrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.nWeight = newWeights.nWeight + (hwbWeightDecrease/6)
                        sliderN.value(newWeights.nWeight)
                    }
                } else if (slider===sliderM) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.mWeight) {
                        // get weight increase difference
                        mWeightIncrease = val - newWeights.mWeight
                        // console.log(mWeightIncrease)
                        // update focus slider with new value
                        newWeights.mWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (mWeightIncrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (mWeightIncrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (mWeightIncrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (mWeightIncrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.alWeight = newWeights.alWeight === 0?  0 : newWeights.alWeight - (mWeightIncrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.nWeight = newWeights.nWeight === 0?  0 : newWeights.nWeight - (mWeightIncrease/6)
                        sliderN.value(newWeights.nWeight)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.mWeight) {
                        // get weight decrease difference
                        mWeightDecrease = newWeights.mWeight - val
                        // console.log(mWeightDecrease)
                        // update focus slider with new value
                        newWeights.mWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight + (mWeightDecrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight + (mWeightDecrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight + (mWeightDecrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight + (mWeightDecrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.alWeight = newWeights.alWeight + (mWeightDecrease/6)
                        sliderAL.value(newWeights.alWeight)
                        newWeights.nWeight = newWeights.nWeight + (mWeightDecrease/6)
                        sliderN.value(newWeights.nWeight)
                    }
                } else if (slider===sliderN) {
                    // make other sliders responsive so as to not go over or below 100%
                    // if slider was increased, decrease the other ones
                    if (val>newWeights.nWeight) {
                        // get weight increase difference
                        nWeightIncrease = val - newWeights.nWeight
                        // console.log(nWeightIncrease)
                        // update focus slider with new value
                        newWeights.nWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight === 0?  0 : newWeights.cWeight - (nWeightIncrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight === 0?  0 : newWeights.edWeight - (nWeightIncrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight === 0?  0 : newWeights.fcWeight - (nWeightIncrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight === 0?  0 : newWeights.hwbWeight - (nWeightIncrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight === 0?  0 : newWeights.mWeight - (nWeightIncrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.alWeight = newWeights.alWeight === 0?  0 : newWeights.alWeight - (nWeightIncrease/6)
                        sliderAL.value(newWeights.alWeight)
                    // if slider was decreased, increase the other ones
                    } else if (val<newWeights.nWeight) {
                        // get weight decrease difference
                        nWeightDecrease = newWeights.nWeight - val
                        // console.log(nWeightDecrease)
                        // update focus slider with new value
                        newWeights.nWeight = val
                        // decrease other sliders so as to not go over 100%
                        newWeights.cWeight = newWeights.cWeight + (nWeightDecrease/6)
                        // update slider handle
                        sliderC.value(newWeights.cWeight)
                        newWeights.edWeight = newWeights.edWeight + (nWeightDecrease/6)
                        sliderED.value(newWeights.edWeight)
                        newWeights.fcWeight = newWeights.fcWeight + (nWeightDecrease/6)
                        sliderFC.value(newWeights.fcWeight)
                        newWeights.hwbWeight = newWeights.hwbWeight + (nWeightDecrease/6)
                        sliderHWB.value(newWeights.hwbWeight)
                        newWeights.mWeight = newWeights.mWeight + (nWeightDecrease/6)
                        sliderM.value(newWeights.mWeight)
                        newWeights.alWeight = newWeights.alWeight + (nWeightDecrease/6)
                        sliderAL.value(newWeights.alWeight)
                    }
                }
                

            // responsiveWeights(sliderAL, "alWeight", val)

            // } else if (slider===sliderC) {
            //     responsiveWeights(sliderC, "cWeight", val)
            // } else if (slider===sliderED) {
            //     responsiveWeights(sliderED, "edWeight", val)
            // } else if (slider===sliderFC) {
            //     responsiveWeights(sliderFC, "fcWeight", val)
            // } else if (slider===sliderHWB) {
            //     responsiveWeights(sliderHWB, "hwbWeight", val)
            // } else if (slider===sliderM) {
            //     responsiveWeights(sliderM, "mWeight", val)
            // } else if (slider===sliderN) {
            //     responsiveWeights(sliderN, "nWeight", val)
            // }

            // console.log(newWeights)
            accessScore(data, newWeights)
            // showData(data, initial_dataset)

            // update the map
            cities = data.features.filter(function(d){return d.properties.city == selected_city })
            cScale = d3.scaleSequentialQuantile([...cities.map(d=>d.properties.accessibil_sc)], d3.interpolateInferno)
            plot
                .data(cities)
                .attr("fill", d => cScale(+d.properties.accessibil_sc)) 
            // update the kde and histogram
            access = cities.map(function(d){ return +d.properties.accessibil_sc; }) 
            x = d3.scaleLinear()
                        .domain([0, d3.max(access)])
                        .range([0, width/1.5]);
            y = d3.scaleLinear()
                        .range([height/4, 0])
                        .domain([0, 7]);

            kde = kernelDensityEstimator(kernelEpanechnikov(0.007), x.ticks(90))
            density =  kde(access)
             // new bins for histogram
            bins = d3.histogram()
                    .domain(x.domain())
                    .thresholds(thresholds)
                    (access)
            yBins = d3.scaleLinear()
                    .domain([0, d3.max(bins, d => d.length) / density.length])
                    .range([height/4, 0])

            // Give these new data to update line and histogram
            line
                .datum(density)
                .transition()
                .duration(1000)
                .attr("fill", "#ff6d00")
                .attr("fill-opacity", ".07")
                .attr("stroke", "#ff6d00")
                .attr("stroke-width", 2)
                .attr("stroke-linejoin", "round")
                    .attr("d",  d3.line()
                    .curve(d3.curveBasis)
                    .x(function(d) { return x(d[0]); })
                    .y(function(d) { return y(d[1]); }));

            hist
                .data(bins)
                .transition()
                .duration(1000)
                .attr("x", d => x(d.x0) + 1)
                .attr("width", d => 3.2)
                .attr("y", d => yBins(d.length / density.length))
                .attr("height", d => yBins(0) - yBins(d.length / density.length));
        }
    })
    }

