class DiseaseInfo:
    def __init__(self):
        # Update disease database to match insect/pest classes
        self.disease_database = {
            'ants': {
                'name': 'Ants',
                'description': 'Small insects that can damage plants by farming aphids or creating nests in plant roots',
                'symptoms': [
                    'Presence of ant colonies near plants',
                    'Aphid infestations',
                    'Soil disturbance around roots'
                ],
                'causes': 'Various ant species',
                'severity': 'Low to Medium'
            },
            'bees': {
                'name': 'Bees',
                'description': 'Generally beneficial insects that pollinate plants, rarely harmful',
                'symptoms': [
                    'Presence of bees around flowering plants',
                    'Hives near gardening areas'
                ],
                'causes': 'Various bee species',
                'severity': 'Low (generally beneficial)'
            },
            'beetle': {
                'name': 'Beetles',
                'description': 'Various beetles can damage plants by feeding on leaves, stems, and roots',
                'symptoms': [
                    'Holes in leaves',
                    'Damaged stems',
                    'Grubs in soil'
                ],
                'causes': 'Various beetle species',
                'severity': 'Medium to High'
            },
            'caterpillar': {
                'name': 'Caterpillars',
                'description': 'Larval stage of butterflies and moths that feed on plant leaves',
                'symptoms': [
                    'Irregular holes in leaves',
                    'Chewed leaf edges',
                    'Presence of frass (droppings)'
                ],
                'causes': 'Larvae of Lepidoptera',
                'severity': 'Medium to High'
            },
            'earthworms': {
                'name': 'Earthworms',
                'description': 'Beneficial organisms that improve soil quality through aeration',
                'symptoms': [
                    'Improved soil structure',
                    'Worm castings on soil surface'
                ],
                'causes': 'Various earthworm species',
                'severity': 'Beneficial'
            },
            'earwig': {
                'name': 'Earwigs',
                'description': 'Nocturnal insects that can damage young plants and seedlings',
                'symptoms': [
                    'Irregular holes in leaves',
                    'Damage to seedlings and soft fruits'
                ],
                'causes': 'Various earwig species',
                'severity': 'Low to Medium'
            },
            'grasshopper': {
                'name': 'Grasshoppers',
                'description': 'Insects that can cause significant defoliation to plants',
                'symptoms': [
                    'Ragged edges on leaves',
                    'Large sections of missing foliage'
                ],
                'causes': 'Various grasshopper species',
                'severity': 'Medium to High'
            },
            'moth': {
                'name': 'Moths',
                'description': 'Adult moths lay eggs that develop into destructive caterpillars',
                'symptoms': [
                    'Presence of adult moths',
                    'Caterpillar damage',
                    'Silk webbing on plants'
                ],
                'causes': 'Various moth species',
                'severity': 'Medium (depends on species)'
            },
            'slug': {
                'name': 'Slugs',
                'description': 'Slimy pests that feed on leaves and soft plant tissues',
                'symptoms': [
                    'Irregular holes in leaves',
                    'Slime trails on plants and soil',
                    'Night feeding damage'
                ],
                'causes': 'Various slug species',
                'severity': 'Medium to High'
            },
            'snail': {
                'name': 'Snails',
                'description': 'Similar to slugs but with shells, feeding on leaves and soft tissues',
                'symptoms': [
                    'Irregular holes in leaves',
                    'Slime trails',
                    'Presence of shells'
                ],
                'causes': 'Various snail species',
                'severity': 'Medium'
            },
            'wasp': {
                'name': 'Wasps',
                'description': 'Can be both beneficial as predators and harmful when nesting near plants',
                'symptoms': [
                    'Presence of wasps around plants',
                    'Wasp nests in garden areas'
                ],
                'causes': 'Various wasp species',
                'severity': 'Low (often beneficial)'
            },
            'weevil': {
                'name': 'Weevils',
                'description': 'Small beetles with distinctive snouts that damage plants',
                'symptoms': [
                    'Notched leaf edges',
                    'Root damage',
                    'Small holes in stems'
                ],
                'causes': 'Various weevil species',
                'severity': 'Medium to High'
            }
        }
        
        # Update treatment recommendations to match pest classes
        self.treatment_recommendations = {
            'ants': {
                'prevention': [
                    'Maintain clean garden areas',
                    'Remove food sources',
                    'Create barriers with diatomaceous earth'
                ],
                'treatment': [
                    'Natural ant baits',
                    'Organic insecticides',
                    'Boiling water for nests'
                ],
                'organic_solutions': [
                    'Diatomaceous earth',
                    'Cinnamon or cayenne pepper barriers',
                    'Vinegar spray'
                ]
            },
            'beetle': {
                'prevention': [
                    'Crop rotation',
                    'Row covers',
                    'Companion planting'
                ],
                'treatment': [
                    'Neem oil spray',
                    'Insecticidal soap',
                    'Bacillus thuringiensis (Bt)'
                ],
                'organic_solutions': [
                    'Handpicking',
                    'Beneficial nematodes',
                    'Garlic spray'
                ]
            },
            # Add entries for all other pests
        }
    
    def get_disease_info(self, disease_name):
        return self.disease_database.get(disease_name, {
            'name': disease_name,
            'description': 'Detailed information not available',
            'symptoms': ['Symptoms not listed'],
            'causes': 'Various factors',
            'severity': 'Unknown'
        })
    
    def get_treatment_recommendations(self, disease_name):
        return self.treatment_recommendations.get(disease_name, {
            'prevention': ['Maintain plant health', 'Regular monitoring'],
            'treatment': ['Consult with pest management specialist'],
            'organic_solutions': ['Research organic methods for this specific pest']
        })
