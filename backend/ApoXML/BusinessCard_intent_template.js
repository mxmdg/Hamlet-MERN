const template = (
	orden, 
	nombre, 
	ancho, 
	alto, 
	paginas, 
	cliente, 
	contactoClienteNombre = "Nombre", 
	contactoClienteApellido = "Apellido",
	contactoClienteEmail = "Email",
	cantidad = 1,
	gramaje = 100,
	materialTipo,
	anchoResma = 210,
	altoResma = 297,
	jobId,
) => {

return `<?xml version="1.0" encoding="UTF-8"?>
<JDF 
	JobID="ApoXML-${orden}" 
	Activation="Active" 
	DescriptiveName="${nombre}" 
	JobPartID="ID_24_ApoXML-BusinessCard_BusinessCard" 
	ID="ApoXMLJob"  
	Status="Waiting" 
	Type="Product" 
	Version="1.4" 
	MaxVersion="1.4" 
	ICSVersions="Base_L1-1.4" 
	xsi:type="Product" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns="http://www.CIP4.org/JDFSchema_1_1" 
	xmlns:agfa="http://www.agfa.com/w3c/gs/jdf/agfaextensions.xsd">
	<!--Created using Convertor v1.2.7 and stylesheet: v1.3.3 for Prepress v110-->
	<!--Creator of original ApoXML was "ApoXML SDK" with Version: "1.1"-->
	<!--General Job Comment-->
	<Comment Name="${nombre}" AgentName="ApoXML Convertor" AgentVersion="1.3.3">www.hamlet.com.ar/jobs/edit/${jobId}</Comment>
	<ResourcePool>
		<!--@FinalProduct 85 x 55 mm-->
		<Component ID="ID_Component_FinalProduct" Class="Quantity" Status="Unavailable" ComponentType="FinalProduct" DescriptiveName="${nombre}" ProductType="Flatwork" Dimensions="${ancho} ${alto}">
			<!--@ProductType is one of: 'Flatwork', 'Folded', 'Brochure' or 'Other;. 'Flatwork' is the only ProductType allowed for Asanti. Note that another spelling is FlatWork as used in JDF1.6. 'Folded' is a folded unbound leaflet, content delivered as a spread. Other is for non-prepress products. -->
		</Component>
		<!--@ColorPool-->
		<ColorPool ID="ID_ColorPool_CMYK" Class="Parameter" Status="Available">
			<Color Name="Cyan" CMYK="1 0 0 0" ColorType="Normal"/>
			<Color Name="Magenta" CMYK="0 1 0 0" ColorType="Normal"/>
			<Color Name="Yellow" CMYK="0 0 1 0" ColorType="Normal"/>
			<Color Name="Black" CMYK="0 0 0 1" ColorType="Normal"/>
		</ColorPool>
		<!--@ColorIntent-->
		<ColorIntent ID="ID_ColorIntent_CMYK" Class="Intent" Status="Available">
			<ColorPoolRef rRef="ID_ColorPool_CMYK"/>
			<!--ColorsUsed is a list of the Colors used in this part.-->
			<ColorsUsed>
				<SeparationSpec Name="Cyan"/>
				<SeparationSpec Name="Magenta"/>
				<SeparationSpec Name="Yellow"/>
				<SeparationSpec Name="Black"/>
			</ColorsUsed>
			<ColorStandard DataType="NameSpan" Actual="CMYK"/>
		</ColorIntent>
		<!--@ColorPool-->
		<ColorPool ID="ID_ColorPool_Gray" Class="Parameter" Status="Available">
			<Color Name="Black" CMYK="0 0 0 1" ColorType="Normal"/>
		</ColorPool>
		<!--@ColorIntent-->
		<ColorIntent ID="ID_ColorIntent_Gray" Class="Intent" Status="Available">
			<ColorPoolRef rRef="ID_ColorPool_Gray"/>
			<!--ColorsUsed is a list of the Colors used in this part.-->
			<ColorsUsed>
				<SeparationSpec Name="Black"/>
			</ColorsUsed>
			<ColorStandard DataType="NameSpan" Actual="Monochrome"/>
		</ColorIntent>
		<!--PartialProduct is used to create a Product Part (like cover/body/insert). For simplicity, it is also used even if there is only one part. In ganging jobs, each Product Part could be a separate Product.-->
		<Component ID="ID_Component_0" Class="Quantity" Status="Unavailable" ProductType="Body" ComponentType="PartialProduct" DescriptiveName="${nombre}" ReaderPageCount="${paginas}"/>
		<!--@BindingOrder is one from: 'None' (Flatwork or Folded), 'Collecting' (=Apogee 'Nested', saddle stitched), 'Gathering' (=Apogee 'Gathered' like Perfect Bound). More details are in BindingType if not Flatwork.-->
		<BindingIntent ID="ID_BindingIntent" Class="Intent" BindingOrder="None" Status="Available"/>
		<!--@CustomerInfo-->
		<CustomerInfo ID="ID_CustomerInfo_Main" Class="Parameter" Status="Available" CustomerID="PI_CompApoXML">
			<!--Main Customer Contact-->
			<ContactRef rRef="ID_Contact_Main"/>
		</CustomerInfo>
		<!--Main Customer Contact-->
		<!--@Contact for Customer-->
		<Contact ID="ID_Contact_Main" Class="Parameter" Status="Available" ContactTypes="Customer Administrator">
			<Company OrganizationName="${cliente}" ProductID="PI_CompApoXML"/>
			<Person FamilyName="${contactoClienteApellido}" DescriptiveName="${contactoClienteNombre}_${contactoClienteApellido}" FirstName="${contactoClienteNombre}" ProductID="PI_Pers_apoxmlNV">
				<ComChannel ChannelType="Phone" ChannelTypeDetails="LandLine" Locator="12345"/>
				<ComChannel ChannelType="Email" Locator="${contactoClienteEmail}"/>
			</Person>
		</Contact>
		<NodeInfo Class="Parameter" ID="ID_NodeInfo_Root" NodeStatus="Waiting" Status="Available"/>
	</ResourcePool>
	<ResourceLinkPool>
		<NodeInfoLink rRef="ID_NodeInfo_Root" Usage="Input"/>
		<CustomerInfoLink rRef="ID_CustomerInfo_Main" Usage="Input"/>
		<ComponentLink rRef="ID_Component_FinalProduct" Usage="Output" Amount="${cantidad}"/>
		<BindingIntentLink rRef="ID_BindingIntent" Usage="Input"/>
		<ComponentLink rRef="ID_Component_0" Usage="Input"/>
	</ResourceLinkPool>
	<!--@AuditPool-->
	<AuditPool>
		<Created ID="crea_root_ID" AgentName="ApoXML Convertor" TimeStamp="2018-09-03T23:54:12+02:00" AgentVersion="1.3.3"/>
	</AuditPool>
	<!--@ProductPart-->
	<!--A Product Part describes either one part of a multipart job (Cover/Body) or the single part (Self-Cover) or one Product of a gang job-->
	<JDF ID="ID_ProdPart_0" Type="Product" Status="Waiting" xsi:type="Product" JobPartID="ID_24_ApoXML-BusinessCard_BusinessCard_0" DescriptiveName="${nombre}">
		<AuditPool>
			<Created ID="crea_0_ID" AgentName="ApoXML Convertor" TimeStamp="2018-09-03T23:54:12+02:00" AgentVersion="1.3.3"/>
		</AuditPool>
		<Comment Name="Instruction" AgentName="ApoXML Convertor" AgentVersion="1.3.3">business cards</Comment>
		<ResourceLinkPool>
			<!--Reference to the content pages for this part. Note that this is usually the same PDF but a different page range.-->
			<ArtDeliveryIntentLink rRef="ID_ArtDeliveryIntent_0" Usage="Input"/>
			<!--Specifying a Press is not really a ProductIntent and not part of the JDF spec. 
				But some systems can provide already Press information so Apogee supports it. ProcessUsage=Paper indicates it is a press.
				A different press also needs a different platesetter, plate size and output settings.-->
			<DeviceLink rRef="ID_Device_Press_0" Usage="Input"/>
			<ComponentLink rRef="ID_Component_0" Usage="Output"/>
			<ColorIntentLink rRef="ID_ColorIntent_CMYK" Usage="Input"/>
			<LayoutIntentLink rRef="ID_LayoutIntent_0" Usage="Input"/>
			<MediaIntentLink rRef="ID_MediaIntent_0" Usage="Input"/>
		</ResourceLinkPool>
		<ResourcePool>
			<!--@LayoutIntent-->
			<!--LayoutIntent contains various info that is related to both Page and Imposition.
				@Sides is used to distinguish between single and double sided printing (Unbound)-->
			<LayoutIntent ID="ID_LayoutIntent_0" Class="Intent" Sides="TwoSidedHeadToHead" Status="Available">
				<!--Finished Dimensions = Closed dimensions = usually page size. For Flatwork they are the same.85 x 55mm-->
				<FinishedDimensions DataType="ShapeSpan" Actual="${ancho} ${alto} 0"/>
				<!--According the JDF spec, Pages are the physical sides in the product. So simplex and duplex printing makes no differences: single sided poster would still set Pages to 2-->
				<Pages DataType="IntegerSpan" Actual="${paginas}"/>
			</LayoutIntent>
			<!--@MediaIntent-->
			<!--MediaIntent specified the media for conventional printing (paper stock), digital printing (paper catalog) and sign and display (media substrate).-->
			<MediaIntent ID="ID_MediaIntent_0" Class="Intent" Status="Available" DescriptiveName="Businesscards-1">
				<MediaType DataType="EnumerationSpan" Actual="Paper"/>
				<!--Paper Weight in gsm-->
				<Weight DataType="NumberSpan" Actual="${gramaje}"/>
				<!--Apogee Prepress will create a Paper Stock for this StockBrand if it was not existing yet. 
						 For Prepress: StockBrand must NOT contain Weight or Thickness
						 StockBrand must contain a reference to the Grade/ISOPaperSubstrate/Coating if the brand is available in multiple grades/coatings-->
				<StockBrand DataType="StringSpan" Actual="${materialTipo}"/>
				<!--Grade: 1=glossy 2=matt 3=glossy-web 4=uncoated-white 5=uncoated-yellowish-->
				<Grade DataType="IntegerSpan" Actual="1"/>
				<!--Thickness in um-->
				<Thickness DataType="NumberSpan" Actual="200"/>
				<!--707 x 500mm-->
				<Dimensions DataType="XYPairSpan" Actual="${anchoResma} ${altoResma}"/>
			</MediaIntent>
			<!--Specifying a Press is not really a ProductIntent.
					But some systems can provide already Press information so Apogee supports it.
					The @DeviceID must contain the same value as defined in Apogee.-->
			<Device Class="Implementation" DeviceID="Large Press" DeviceType="Press" ID="ID_Device_Press_0" Status="Available"/>
			<!--@ArtDeliveryIntent-->
			<!--ArtDelivery is used to allow specifying the PDF Content location-->
			<ArtDeliveryIntent ID="ID_ArtDeliveryIntent_0" Class="Intent" Status="Available">
				<ArtDelivery ArtDeliveryType="DigitalFile">
					<RunListRef rRef="ID_Run_0"/>
				</ArtDelivery>
			</ArtDeliveryIntent>
			<!--@RunList-->
			<!--RunList is used in case the location of the PDF content files is already known or for versioning.-->
			<!--@RunList Creation: No versioning, Specific URL per part-->
			<RunList ID="ID_Run_0" Class="Parameter" NPage="2" Pages="0 ~ 1" Status="Available">
				<LayoutElement>
					<FileSpec MimeType="application/pdf" URL="file://be.local/dfs/data/be/GS/RD/EQAP_Testfiles/JDFtank/Content/BusinessCardCMYK_DS.pdf"/>
				</LayoutElement>
			</RunList>
		</ResourcePool>
	</JDF>
</JDF>
`
}

module.exports = template;